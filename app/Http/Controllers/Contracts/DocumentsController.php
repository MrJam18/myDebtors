<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Contract\Contract;
use App\Models\Contract\IpInitStatement;
use App\Models\CourtClaim\CourtClaim;
use App\Models\CourtClaim\CourtClaimStatus;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\Court\Court;
use App\Models\Subject\People\Agent;
use App\Services\Documents\CourtClaimDocService;
use App\Services\Documents\CourtRequestForExecutiveDocDocument;
use App\Services\Documents\EnforcementProceedingFamiliarizationDocView;
use App\Services\Documents\IpInitStatementDocument;
use App\Services\Documents\StandardDocService;
use App\Services\Documents\Views\BailiffExecutiveDocumentRequestDocView;
use App\Services\Documents\Views\CourtResolutionRequestView;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
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
        $response = $docService->createDocument($courtClaim);
        if($formData['isCourtClaimCreated']) {
            $countService = $docService->getCountService();
            $moneySum = $countService->getResult();
            $moneySum->save();
            $courtClaim->moneySum()->associate($moneySum);
            $courtClaim->fee = $countService->getFee($courtClaim->type);
            $courtClaim->user_id = Auth::id();
            $courtClaim->save();
        }
        return $response;
    }

    function createIpInitStatement(Request $request, Contract $contract): StreamedResponse
    {
        $ipInitStatement = new IpInitStatement();
        $data = $request->all();
        $executiveDocument = ExecutiveDocument::find($data['executiveDocumentId']);
        if($executiveDocument->contract->id !== $contract->id) throw new ShowableException('Не совпадают id исполнительного документа и текущего контракта');
        $agent = Agent::findWithGroupId($data['agentId']);
        $ipInitStatement->user()->associate(Auth::user());
        $ipInitStatement->agent()->associate($agent);
        $ipInitStatement->executiveDocument()->associate($executiveDocument);
        $ipInitStatement->save();
        $document = new IpInitStatementDocument($ipInitStatement);
        return $document->getFileResponse("ЗВИП по договору от {$contract->issued_date->format(RUS_DATE_FORMAT)} г., {$contract->debtor->name->initials()}");
    }

    function getCourtClaimDoc(CourtClaim $claim, CourtClaimDocService $docService): StreamedResponse
    {
        return $docService->createDocument($claim);
    }

    function getCourtRequestForExecutiveDoc(Request $request): StreamedResponse
    {
        $claim = $this->prepareCourtClaim($request);
        $document = new CourtRequestForExecutiveDocDocument($claim);
        return $document->getFileResponse();
    }

    function getResolutionRequest(Request $request): StreamedResponse
    {
        $claim = $this->prepareCourtClaim($request);
        $view = new CourtResolutionRequestView($claim);
        return (new StandardDocService($view))->getFileResponse();
    }

    function getBailiffExecutiveDocRequest(Request $request, Contract $contract): StreamedResponse
    {
        $enforcementProceeding = EnforcementProceeding::find((int)$request->input('enforcementProceedingId'));
        if($enforcementProceeding->executiveDocument->contract_id !== $contract->id) {
            throw new ShowableException('Исполнительный документ не соответствует с договором');
        }
        $agent = Agent::findWithGroupId((int)$request->input('agentId'));
        $view = new BailiffExecutiveDocumentRequestDocView($enforcementProceeding, $agent);
        return (new StandardDocService($view))->getFileResponse();
    }

    function getEnforcementProceedingFamiliarization(Request $request, Contract $contract): StreamedResponse
    {
        $enforcementProceeding = EnforcementProceeding::find((int)$request->input('enforcementProceedingId'));
        if($enforcementProceeding->executiveDocument->contract_id !== $contract->id) {
            throw new ShowableException('Исполнительный документ не соответствует с договором');
        }
        $agent = Agent::findWithGroupId((int)$request->input('agentId'));
        $view = new EnforcementProceedingFamiliarizationDocView($enforcementProceeding, $agent);
        return (new StandardDocService($view))->getFileResponse();
    }

    private function prepareCourtClaim(Request $request): CourtClaim
    {
        $claim = CourtClaim::findWithGroupId((int)$request->input('courtClaimId'));
        $agent = Agent::findWithGroupId((int)$request->input('agentId'));
        if($claim->agent->id !== $agent->id) {
            $claim->agent()->associate($agent);
            $claim->save();
        }
        return $claim;
    }

}