<?php

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\AgentsController;
use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Base\CustomBuilder;
use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\EnforcementProceeding\EnforcementProceedingStatus;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class EnforcementProceedingsController extends Controller
{
    public function getStatuses(): Collection|array
    {
        return EnforcementProceedingStatus::query()->get();
    }
    public function setAllByExecutiveDoc(Request $request, Contract $contract, ExecutiveDocument $executiveDocument): string
    {
        if ($contract->id !== $executiveDocument->contract->id) throw new ShowableException('Договор не соответствует исполнительному документу');
        /**
         * @var EnforcementProceeding $enforcementProceeding
         * @var EnforcementProceedingStatus $proceedingStatus
         */
        $data = $request->all();
        /**
         * @var EnforcementProceeding $lastProceeding;
         */
        $lastProceeding = null;
        foreach ($data['enforcementProceedings'] as $proceedingData) {
            if(isset($proceedingData['id'])) {
                $enforcementProceeding = EnforcementProceeding::find((int)$proceedingData['id']);
                if($enforcementProceeding->executiveDocument->id !== $executiveDocument->id) {
                    throw new ShowableException('Исполнительное производство не совпадает с исполнительным документом');
                }
            }
            else {
                $enforcementProceeding = new EnforcementProceeding();
                $enforcementProceeding->executiveDocument()->associate($executiveDocument);
                $enforcementProceeding->fee = 0;
                $enforcementProceeding->penalties = 0;
                $enforcementProceeding->percents = 0;
                $enforcementProceeding->main = 0;
                $enforcementProceeding->sum = 0;
            }
            $enforcementProceeding->begin_date= $proceedingData['begin_date'];
            $enforcementProceeding->end_date = $proceedingData['end_date'] ?? null;
            $enforcementProceeding->number = $proceedingData['number'];
            $enforcementProceeding->status_date = now();
            $enforcementProceeding->status_id = $proceedingData['status_id'];
            $enforcementProceeding->bailiff_id = $proceedingData['bailiff']['id'];
            if(!$lastProceeding || $lastProceeding->begin_date < $enforcementProceeding->begin_date) $lastProceeding = $enforcementProceeding;
            $enforcementProceeding->save();
        }
        if(count($data['deleteIds']) !== 0) {
            $executiveDocument->enforcementProceedings()->whereIn('id', $data['deleteIds'])->delete();
        }
        return "№ {$lastProceeding->number} от {$lastProceeding->begin_date->format(RUS_DATE_FORMAT)} г.";
    }

    public function getAll($executiveDocId): array
    {
        $proceedings = EnforcementProceeding::query()
            ->where('executive_document_id', $executiveDocId)
            ->with('bailiff.name')
            ->get()
            ->toArray();

        $proceedings = array_map(function($item) {
            $item['bailiff']['full_name'] = $item['bailiff']['name']['surname'] . ' ' . $item['bailiff']['name']['name'] . ' ' . $item['bailiff']['name']['patronymic'];
            return $item;
        }, $proceedings);

        return $proceedings;
    }
    public function getListByExecutiveDoc(Contract $contract, ExecutiveDocument $executiveDocument): Collection
    {
        if($contract->id !== $executiveDocument->contract->id) throw new ShowableException('Договор не соответствует исполнительному документу');
        $list = $executiveDocument->enforcementProceedings()->orderBy('begin_date')->get();
        return $list->map(function (EnforcementProceeding $proceeding) {
            $returned = $proceeding->toArray();
            $returned['bailiff'] = [
                'name' => $proceeding->bailiff->name->getFull(),
                'id' => $proceeding->bailiff->id
                ];
            return $returned;
        });
    }
    function getSearchListByContract(Contract $contract, SearchRequest $request): Collection
    {
        $searchString = $request->validated();
        $query = $contract->executiveDocuments()->joinRelation('enforcementProceedings');
        if(isRusDate($searchString)) $query->searchByRusDate(['enforcement_proceedings.begin_date'], $searchString);
        else $query->search(['enforcement_proceedings.number' => $searchString]);
        $list = $query->limit(5)->
        select(['enforcement_proceedings.number', 'enforcement_proceedings.begin_date', 'enforcement_proceedings.id'])->get();
        return $list->map(function (ExecutiveDocument $executiveDocument) {
            $date = (new Carbon($executiveDocument->begin_date))->format(RUS_DATE_FORMAT);
            return [
                'id' => $executiveDocument->id,
                'name' => "$executiveDocument->number от $date г."
            ];
        });
    }
    function getListForChooser(Contract $contract): Collection
    {
        $executiveDocsList = $contract->executiveDocuments()->with('enforcementProceedings')->get();
        $list = new Collection();
        $executiveDocsList->each(function (ExecutiveDocument $executiveDoc) use ($list) {
            $executiveDoc->enforcementProceedings->each(function (EnforcementProceeding $proceeding) use ($list, $executiveDoc) {
                $returned = $proceeding->toArray();
                $returned = array_merge($returned, $proceeding->getSumsStringArray());
                $returned['id'] = $proceeding->id;
                $returned['begin_date'] = $proceeding->begin_date->format(RUS_DATE_FORMAT) . ' г.';
                if($proceeding->end_date) {
                    $returned['end_date'] = $proceeding->end_date->format(RUS_DATE_FORMAT) . ' г.';
                }
                $returned['status'] = $proceeding->proceedingStatus->name;
                $returned['bailiff'] = $proceeding->bailiff->name;
                $returned['executiveDoc'] = $executiveDoc->getName();
                $list->push($returned);
            });
        });
        return $list;
    }
    function getLastAndDefaultAgent(Contract $contract, ExecutiveDocument $executiveDocument): array
    {
        if($executiveDocument->contract_id !== $contract->id) throw new ShowableException('Исп. документ не совпадает с договором');
        /**
         * @var EnforcementProceeding $lastProceeding
         */
        $lastProceeding = $executiveDocument->enforcementProceedings()->orderBy('begin_date', 'DESC')->first();
        if($lastProceeding) $lastProceeding = [
            'id' => $lastProceeding->id,
            'name' => "$lastProceeding->number от {$lastProceeding->begin_date->format(RUS_DATE_FORMAT)} г."
        ];
        $agentController = new AgentsController();
        $agent = $agentController->getDefault();
        return [
            'agent' => $agent,
            'enforcementProceeding' => $lastProceeding
        ];
    }
}
