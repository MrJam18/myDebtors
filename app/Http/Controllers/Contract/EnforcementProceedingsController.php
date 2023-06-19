<?php

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\Controller;
use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\EnforcementProceeding\EnforcementProceedingStatus;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\Bailiff\Bailiff;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\isEmpty;

class EnforcementProceedingsController extends Controller
{
    public function getStatuses(): Collection|array
    {
        return EnforcementProceedingStatus::query()->get();
    }

    public function create(Request $request):void
    {
        /**
         * @param EnforcementProceeding $enforcementProceeding
         * @param EnforcementProceedingStatus $proceedingStatus
         */
        $data = $request->all();
        $enforcementProceeding = new EnforcementProceeding();

        $enforcementProceeding->begin_date= $data['beginDate'];
        $enforcementProceeding->end_date = $data['endDate'] ?? null;
        $enforcementProceeding->number = $data['number'];

        $proceedingStatus = EnforcementProceedingStatus::query()->find($data['enforcementProceedingStatus']);
        $enforcementProceeding->proceedingStatus()->associate($proceedingStatus);

        $bailiff = Bailiff::query()->find($data['bailiff']);
        $enforcementProceeding->bailiff()->associate($bailiff);

        $enforcementProceeding->fee = $data['fee'] ?? 0;
        $enforcementProceeding->penalties = $data['penalties'] ?? 0;
        $enforcementProceeding->percents = $data['percents'] ?? 0;
        $enforcementProceeding->main = $data['main'] ?? 0;
        $enforcementProceeding->sum = $data['main'] + $data['percents'] + $data['penalties'] + $data['fee'];

        $executiveDocument = ExecutiveDocument::query()->find($data['executiveDocId']);
        $enforcementProceeding->executiveDocument()->associate($executiveDocument);

        $enforcementProceeding->save();


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
        $list->map(function (EnforcementProceeding $proceeding) {
            $returned = $proceeding->toArray();
            $returned['status'] = [
                'name' => $proceeding->proceedingStatus->name,
                'id' => $proceeding->proceedingStatus->id
                ];
            $returned['bailiff'] = [
                'name' => $proceeding->bailiff->name,
                'id' => $proceeding->bailiff->id
                ];
            return $returned;
        });
        return $list;
    }
}
