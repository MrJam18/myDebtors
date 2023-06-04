<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\CourtClaim\CourtClaimStatus;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\MoneySum;
use App\Models\Subject\Court\Court;
use App\Models\Subject\People\Agent;
use App\Services\Documents\CourtClaimDocService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentsController extends AbstractController
{
    function createCourtClaim(Request $request, CourtClaimDocService $docService, Contract $contract): StreamedResponse
    {
        $data = $request->all();
        $formData = $data['formData'];
        $courtClaim = new CourtClaim();
        $courtClaim->type()->associate(CourtClaimType::find($data['typeId']));
        $courtClaim->status()->associate(CourtClaimStatus::find(1));
        $courtClaim->court()->associate(Court::find($data['courtId']));
        $courtClaim->contract()->associate($contract);
        $courtClaim->agent()->associate(Agent::findWithGroupId($data['agentId']));
        $courtClaim->count_date = new Carbon($formData['date']);
        $courtClaim->is_contract_jurisdiction = $formData['is_contract_jurisdiction'];
        $courtClaim->is_ignored_payments = $formData['is_ignored_payments'];
        $courtClaim->status_date = now();
//        $courtClaim->moneySum = new MoneySum();
        $response = $docService->createDocument($courtClaim);
        $countService = $docService->getCountService();
        $moneySum = $countService->getResult();
        $moneySum->save();
        $courtClaim->moneySum()->associate($moneySum);
        $courtClaim->fee = $countService->getFee();
        $courtClaim->save();
        return $response;
    }
}