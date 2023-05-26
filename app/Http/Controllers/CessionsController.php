<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Cession\Cession;
use App\Models\Cession\CessionEnclosure;
use App\Models\Cession\CessionGroup;
use App\Models\Subject\Creditor\Creditor;
use App\Providers\Database\CessionsProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CessionsController extends AbstractController
{
    function getList(PaginateRequest $request, CessionsProvider $provider): array
    {
        $paginator = $provider->getList($request->validated());
        $list = $paginator->items()->map(function (CessionGroup $cession) {
            /**
             * @var Cession $lastCession
             */
            $lastCession = $cession->cessions()->orderBy('transfer_date', 'desc')->first();
           return [
               'name' => $cession->name,
                'lastAssignor' => $lastCession->assignor->name,
               'lastAssignee' => $lastCession->assignee->name,
               'lastTransferDate' => $lastCession->transfer_date->format(RUS_DATE_FORMAT),
               'created_at' => $cession->created_at->format(RUS_DATE_TIME_FORMAT),
               'idd' => $cession->id
           ];
        });
        return $paginator->jsonResponse($list);
    }

    function createOne(Request $request): void
    {
        $data = $request->all();
        DB::transaction(function () use(&$data){
            $cessionGroup = new CessionGroup();
            $cessionGroup->name = $data['name'];
            $cessionGroup->user()->associate(Auth::user());
            $cessionGroup->save();
            foreach ($data['cessions'] as $cessionData) {
                $cession = new Cession();
                $this->updateCessionData($cessionData, $cession, $cessionGroup);
            }
        });
    }

    function changeOne(Request $request, CessionGroup $cessionGroup): void
    {
        $this->transaction($request, function (array $data) use ($cessionGroup){
            $this->throwExceptionIfGroupDontCompared($cessionGroup);
            $cessionGroup->name = $data['name'];
            $cessionGroup->save();
            foreach ($data['cessions'] as $cessionData) {
                /**
                 * @var Cession $cession
                 */
                if(isset($cessionData['id'])) {
                    $cession = Cession::query()->where('cession_group_id', $cessionGroup->id)->find($cessionData['id']);
                    $this->exceptionIfNull($cession);
                    $cession->enclosures->each(fn(CessionEnclosure $enclosure)=> $enclosure->delete());
                }
                else $cession = new Cession();
                $this->updateCessionData($cessionData, $cession, $cessionGroup);
            }
            foreach ($data['deleteIds'] as $deleteId) {
                $cession = Cession::query()->where('cession_group_id', $cessionGroup->id)->find($deleteId);
                $this->exceptionIfNull($cession);
                $cession->delete();
            }
        });
    }

    private function updateCessionData(array $cessionData, Cession $cession, ?CessionGroup $cessionGroup = null)
    {
        $cession->transfer_date = $cessionData['transferDate'];
        $cession->use_default_text = $cessionData['useDefaultText'];
        $cession->text = $cessionData['text'];
        $cession->number = $cessionData['number'];
        $cession->sum = $cessionData['sum'];
        $cession->assignee()->associate(Creditor::find($cessionData['assigneeId']));
        $cession->assignor()->associate(Creditor::find($cessionData['assignorId']));
        if($cessionGroup) $cession->cessionGroup()->associate($cessionGroup);
        $cession->save();
        foreach ($cessionData['enclosures'] as $enclosureData) {
            $enclosure = new CessionEnclosure();
            $enclosure->cession()->associate($cession);
            $enclosure->name = $enclosureData;
            $enclosure->save();
        }
    }

    function getOne(CessionGroup $cessionGroup): array
    {
        return [
            'name' => $cessionGroup->name,
            'id' => $cessionGroup->id,
            'cessions' => $cessionGroup->cessions()->with(['assignor:id,name,short', 'assignee:id,name,short', 'enclosures'])->get()->map(function (Cession $cession) {
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
            'count' => $cessionGroup->cessions->count()
        ];
    }

    function deleteOne(CessionGroup $cessionGroup): void
    {
        $this->throwExceptionIfGroupDontCompared($cessionGroup);
        DB::transaction(function () use ($cessionGroup) {
            $cessionGroup->cessions->each(function(Cession $cession){
                $cession->enclosures->each(fn(CessionEnclosure $enclosure)=> $enclosure->delete());
                $cession->delete();
            });
            $cessionGroup->delete();
        });
    }
}