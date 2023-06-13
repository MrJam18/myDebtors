<?php

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
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
        // Log::info(dump($proceedings));
        return EnforcementProceeding::query()->where('executive_document_id', $executiveDocId)->get()->toArray();
    }
}
