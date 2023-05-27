<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CountService
{
    private float $percent;
    private float $penalty;
    private Carbon $startDate;
    private Carbon $endDate;
    private Years $years;
    private float $issued;
    private float $main;
    private MoneySum $sum;
    private Collection $breaks;
    private bool $isPercentsCounted;
    private bool $isPenaltiesCounted;

    public function __construct(Contract $contract, Carbon $endDate)
    {
        $this->percent = $contract->percent;
        $this->penalty = $contract->penalty;
        $this->startDate = $contract->issued_date;
        $this->endDate = $endDate;
        $this->issued = $contract->issued_sum;
        $this->sum = new MoneySum();
        $this->breaks = new Collection();
        $this->sum->main = $contract->issued_sum;
        $this->sum->percents = 0;
        $this->sum->penalties = 0;

        $this->main = $contract->issued_sum;
        $this->years = new Years($this->startDate, $this->endDate, $contract->payments);
    }

    function count(Contract $contract, Carbon $end_date)
    {
        $this->addBreak($this->startDate);
        $firstYear = $this->years->list->first();
        $lastYear = $this->years->getLastYear();
        if($lastYear) {

        }
    }

    private function addBreak(Carbon $date, Payment $payment = null): void
    {
        $this->breaks->push(new CountBreak($date, $this->sum->replicate(), $payment, $this->isPercentsCounted, $this->isPenaltiesCounted));
    }
}