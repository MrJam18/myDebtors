<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\CourtClaim\CourtClaim;
use App\Services\Counters\CountService;

class LoanCourtOrderDocView extends LoanClaimDocView
{
    public function __construct(CourtClaim $claim, CountService $countService)
    {
        parent::__construct($claim, $countService);
        $this->debtorTitle = 'Должник';
        $this->creditorTitle = 'Взыскатель';
        $this->askHeader->push('На основании изложенного, руководствуясь ст.121-123 ГПК РФ,', 'Прошу выдать судебный приказ, в котором:');
    }
}