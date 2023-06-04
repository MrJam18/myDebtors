<?php
declare(strict_types=1);

namespace App\Services\Documents;

use App\Models\CourtClaim\CourtClaim;
use App\Services\Counters\CountService;
use App\Services\Counters\CreditCountService;
use App\Services\Counters\IgnorePaymentsLoanCountService;
use App\Services\Counters\LimitedLoanCountService;
use App\Services\Documents\Base\DocumentService;
use App\Services\Documents\Views\LoanCourtClaimDocView;
use App\Services\Documents\Views\LoanCourtOrderDocView;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CourtClaimDocService extends DocumentService
{
    protected CountService $countService;

    function createDocument(CourtClaim $claim): StreamedResponse
    {
        if($claim->contract->type->id === 1) {
            if($claim->is_ignored_payments) $this->countService = new IgnorePaymentsLoanCountService();
            else $this->countService = new LimitedLoanCountService();
        }
        else $this->countService = new CreditCountService();
        $this->countService->count($claim->contract, $claim->count_date);
        if($claim->type->id === 1) $this->view = new LoanCourtOrderDocView($claim, $this->countService);
        else $this->view = new LoanCourtClaimDocView($claim, $this->countService);
        $this->view->buildDocument();
        return $this->getFileResponse($claim->type->name . ' по договору займа № ' . $claim->contract->number . ' от ' . $claim->contract->issued_date->format(RUS_DATE_FORMAT));
    }

    /**
     * @return CountService
     */
    public function getCountService(): CountService
    {
        return $this->countService;
    }

}