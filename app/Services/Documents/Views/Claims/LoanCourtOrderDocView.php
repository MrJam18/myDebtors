<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\CourtClaim\CourtClaim;
use App\Services\Counters\CountService;

class LoanCourtOrderDocView extends LoanClaimDocView
{
    use CourtOrderTrait;
}