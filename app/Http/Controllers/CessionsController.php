<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Cession\Cession;
use App\Models\Cession\CessionEnclosure;
use App\Models\Cession\CessionGroup;
use App\Models\Subject\Creditor\Creditor;
use App\Providers\Database\CessionsProvider;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CessionsController extends AbstractController
{
    function getList(PaginateRequest $request, CessionsProvider $provider): array
    {
        $paginator = $provider->getList($request->validated());
        return $paginator->jsonResponse();
    }

    function setOne(Request $request): array
    {
        $cessionGroup = null;
        $this->transaction($request, function (array $data) use (&$cessionGroup){
            if(isset($data['cessionGroupId'])) {
                $cessionGroup = CessionGroup::findWithGroupId($data['cessionGroupId']);
            }
            else $cessionGroup = new CessionGroup();
            $cessionGroup->name = $data['name'];
            $cessionGroup->user_id = Auth::id();
            $cessionGroup->save();
            /**
             * @var Cession $cession
             */
            $cession = null;
            foreach ($data['list'] as $index => $cessionData) {
                if(isset($cessionData['id'])) {
                    $cession = Cession::query()->where('cession_group_id', $cessionGroup->id)->find($cessionData['id']);
                    $this->exceptionIfNull($cession);
                    $cession->enclosures->each(fn(CessionEnclosure $enclosure)=> $enclosure->delete());
                }
                else $cession = new Cession();
                $cession->transfer_date = $cessionData['transferDate'];
                $cession->use_default_text = $cessionData['useDefaultText'];
                $cession->text = $cessionData['text'];
                $cession->number = $cessionData['number'];
                $cession->sum = $cessionData['sum'] ?? null;
                $cession->assignee()->associate(Creditor::findWithGroupId($cessionData['assignee']['id']));
                $cession->assignor()->associate(Creditor::findWithGroupId($cessionData['assignor']['id']));
                $cession->cessionGroup()->associate($cessionGroup);
                $cession->save();
                foreach ($cessionData['enclosures'] as $enclosureData) {
                    $enclosure = new CessionEnclosure();
                    $enclosure->cession()->associate($cession);
                    $enclosure->name = $enclosureData;
                    $enclosure->save();
                }
//                $this->updateCessionData($cessionData, $cession, $cessionGroup);
            }
            if($cession) {
                $assignee = $cession->assignee;
                if($data['isDefaultCession']) {
                    $assignee->defaultCession()->associate($cessionGroup);
                    $assignee->save();
                }
                else {
                    if($assignee->defaultCession?->id === $cessionGroup->id) {
                        $assignee->defaultCession()->dissociate();
                        $assignee->save();
                    }
                }
            }
            foreach ($data['deleteIds'] as $deleteId) {
                /**
                 * @var Cession $cession;
                 */
                $cession = Cession::query()->where('cession_group_id', $cessionGroup->id)->find($deleteId);
                if($cession->cession_group_id !== $cessionGroup->id) throw new ShowableException('Цессия на удаление не соответствует группе цессий');
                $cession->enclosures->each(fn(CessionEnclosure $enclosure)=> $enclosure->delete());
                $this->exceptionIfNull($cession);
                $cession->delete();
            }
        });
        return [
            'name' => $cessionGroup->name,
            'id' => $cessionGroup->id
        ];
    }

    function getOne(CessionGroup $cessionGroup): array
    {
        return [
            'name' => $cessionGroup->name,
            'isDefaultCession' => (bool)$cessionGroup->defaultCreditor,
            'list' => $cessionGroup->cessions()->with(['assignor:id,name,short', 'assignee:id,name,short', 'enclosures'])->orderBy('transfer_date', 'asc')->get()->map(function (Cession $cession) {
                return [
                    'assignor' => $cession->assignor,
                    'assignee' => $cession->assignee,
                    'enclosures' => $cession->enclosures->map(function (CessionEnclosure $enclosure) {
                        return $enclosure->name;
                    }),
                    'sum' => $cession->sum,
                    'text' => $cession->text,
                    'useDefaultText' => $cession->use_default_text,
                    'transferDate' => $cession->transfer_date->format(ISO_DATE_FORMAT),
                    'number' => $cession->number,
                    'id' => $cession->id
                ];
            }),

        ];
    }

    function deleteOne(CessionGroup $cessionGroup): void
    {
        DB::transaction(function () use ($cessionGroup) {
            $cessionGroup->cessions->each(function(Cession $cession){
                $cession->enclosures->each(fn(CessionEnclosure $enclosure)=> $enclosure->delete());
                $cession->delete();
            });
            $cessionGroup->delete();
        });
    }
    function getSearchList(SearchRequest $request, CessionsProvider $provider): Collection
    {
        $searchString = strtolower($request->validated());
        $withNull = false;
        if($searchString && str_contains('принадлежит выдавшей организации', $searchString)) {
           $null = [
               'id' => null,
               'name' => 'Принадлежит выдавшей организации'
           ];
           $withNull = true;
        }
        $list = $provider->getSearchList($request->validated(), (int)$request->input('creditorId'), $withNull);
        if(isset($null)) $list->push($null);
        return $list;
    }
}