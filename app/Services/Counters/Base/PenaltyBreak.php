<?php
declare(strict_types=1);

namespace App\Services\Counters\Base;

use App\Models\Contract\Payment;
use App\Models\MoneySum;
use Carbon\Carbon;

class PenaltyBreak
{
    public function __construct(
        public Carbon $date,
        public MoneySum $sum,
        public ?Payment $payment = null
    )
    {
    }

}