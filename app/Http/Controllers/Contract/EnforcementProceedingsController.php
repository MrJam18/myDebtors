<?php

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\Controller;
use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\EnforcementProceeding\EnforcementProceedingStatus;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class EnforcementProceedingsController extends Controller
{
    public function getStatuses(): Collection|array
    {
        return EnforcementProceedingStatus::query()->get();
    }
    public function setAllByExecutiveDoc(Request $request, Contract $contract, ExecutiveDocument $executiveDocument):void
    {
        if ($contract->id !== $executiveDocument->contract->id) throw new ShowableException('Договор не соответствует исполнительному документу');
        /**
         * @var EnforcementProceeding $enforcementProceeding
         * @var EnforcementProceedingStatus $proceedingStatus
         */
        $data = $request->all();

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
            }
            $enforcementProceeding->begin_date= $proceedingData['begin_date'];
            $enforcementProceeding->end_date = $proceedingData['end_date'] ?? null;
            $enforcementProceeding->number = $proceedingData['number'];
            $enforcementProceeding->status_date = now();
            $enforcementProceeding->status_id = $proceedingData['status_id'];
            $enforcementProceeding->bailiff_id = $proceedingData['bailiff']['id'];
            $enforcementProceeding->fee = $proceedingData['fee'];
            $enforcementProceeding->penalties = $proceedingData['penalties'];
            $enforcementProceeding->percents = $proceedingData['percents'];
            $enforcementProceeding->main = $proceedingData['main'];
            $enforcementProceeding->sum = $enforcementProceeding->main + $enforcementProceeding->percents + $enforcementProceeding->penalties + $enforcementProceeding->fee;
            $enforcementProceeding->save();
        }
        if(count($data['deleteIds']) !== 0) {
            $executiveDocument->enforcementProceedings()->whereIn('id', $data['deleteIds'])->delete();
        }
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
        $list = $executiveDocument->enforcementProceedings;
        return $list->map(function (EnforcementProceeding $proceeding) {
            $returned = $proceeding->toArray();
            $returned['bailiff'] = [
                'name' => $proceeding->bailiff->name->getFull(),
                'id' => $proceeding->bailiff->id
                ];
            Log::info(print_r($returned, true));
            return $returned;
        });
    }
}
