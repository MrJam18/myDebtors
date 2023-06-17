<?php

namespace App\Http\Controllers\Contract;

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

    function getLastIdAndName(Contract $contract): ?array
    {
        /**
         * @var EnforcementProceeding $enforcementProceeding;
         * @var ExecutiveDocument $executiveDoc;
         */
        $executiveDoc = $contract->executiveDocument()->orderBy('issued_date', 'desc')->first();
        if($executiveDoc) {
            $enforcementProceeding = $executiveDoc->enforcementProceedings()->orderBy('begin_date', 'desc')->first();
        }
        else return null;
        if($enforcementProceeding) {
            return [
                'id' => $enforcementProceeding->id,
                'name' => "№ $enforcementProceeding->number от {$enforcementProceeding->begin_date->format(RUS_DATE_FORMAT)} г."
            ];
        }
        return null;
    }

    public function create(Request $request)
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
        $enforcementProceeding->status_date = now();
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
}
