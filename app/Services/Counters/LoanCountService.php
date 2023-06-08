<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Payment;
use Carbon\Carbon;

abstract class LoanCountService extends CountService
{

    protected function countPayment(Payment $payment): void
    {
        $snapshot = $this->sum->replicate();
        $this->sum->percents -= $payment->moneySum->sum;
        if ($this->sum->percents < 0) {
            $this->sum->main += $this->sum->percents;
            $this->sum->percents = 0;
            if ($this->sum->main < 0) {
                $this->sum->penalties += $this->sum->main;
                $this->sum->main = 0;
            }
        }
        $payment->moneySum->percents = $snapshot->percents - $this->sum->percents;
        $payment->moneySum->penalties = $snapshot->penalties - $this->sum->penalties;
        $payment->moneySum->main = $snapshot->main - $this->sum->main;
    }

    protected function countPercents(Carbon $startDate, Carbon $endDate): float
    {
        $counted = $this->getPercents($startDate, $endDate, $this->percent);
        $this->sum->percents += $counted;
        return $counted;
    }
    protected function countPenalties(Carbon $startDate, Carbon $endDate): float
    {
        $counted = $this->getPercents($startDate, $endDate, $this->penalty);
        $this->sum->penalties += $counted;
        return $counted;
    }
    protected function countPenaltiesPeriod($startDate, $endDate): float {
        $counted = 0;
        if ($this->isPenaltiesCounted['started']) {
            $counted = $this->countPenalties($startDate, $endDate);
        } elseif ($endDate > $this->dueDate) {
            $this->isPenaltiesCounted['started'] = true;
            $counted = $this->countPenalties($this->dueDate, $endDate);
        }
        return $counted;
    }
    protected function getPercents(Carbon $startDate, Carbon $endDate, float $percent): float
    {
        $days = $startDate->diffInDays($endDate);
        if($endDate->isLeapYear()) $daysInYear = 366;
        else $daysInYear = 365;
        return $this->sum->main * $days / $daysInYear * $percent / 100;
    }
}