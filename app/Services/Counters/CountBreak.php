<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Payment;
use App\Models\MoneySum;
use Carbon\Carbon;

class CountBreak
{
    public function __construct(
        public Carbon $date,
        public MoneySum $sum,
        public ?Payment $payment = null,
        public bool $isPercentsCounted = true,
        public bool $isPenaltiesCounted = true,
    )
    {

    }
}