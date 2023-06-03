<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\Holiday;
use App\Models\MoneySum;
use Carbon\Carbon;

class CreditCountService extends CountService
{
    protected int $month_due_date;
    protected float $month_due_sum;
    protected float $penaltyMain = 0;
    protected float $penaltyPercents = 0;

    function count(Contract $contract, Carbon $endDate): MoneySum
    {
        $this->month_due_date = $contract->month_due_date;
        $this->month_due_sum = $contract->month_due_sum;
        $result = parent::count($contract, $endDate);
        $result->main += $this->penaltyMain;
        $result->percents += $this->penaltyPercents;
        $result->percents = floor($result->percents);
        return $result;
    }

    protected function countPeriod(Carbon $startDate, Carbon $endDate): void
    {
        if($startDate->day > $this->month_due_date) $paymentFirstDate = ($startDate->clone())->addMonth()->setDay($this->month_due_date);
        else $paymentFirstDate = $startDate->clone()->setDay($this->month_due_date);
        $this->skipDaysOff($paymentFirstDate);
        if($endDate > $paymentFirstDate && $paymentFirstDate < $this->dueDate) {
            $this->countAllByDueMonth($startDate, $paymentFirstDate);
            $paymentDate = $paymentFirstDate;
            for($month = $paymentFirstDate->month + 1; $month <= $endDate->month; $month++) {
                $nextPaymentDate = new Carbon($endDate->year . '-' . $month . '-' . $this->month_due_date);
                $this->skipDaysOff($nextPaymentDate);
                $this->addBreak($paymentDate);
                if($nextPaymentDate < $this->dueDate) {
                    $this->countAllByDueMonth($paymentDate, $nextPaymentDate);
                    $paymentDate = $nextPaymentDate;
                }
                else break;
            }
            $this->countEnd($paymentDate, $endDate);
        }
        else {
            $this->countEnd($startDate, $endDate);

        }
    }

    protected function countPayment(Payment $payment): void
    {
        $snapshot = $this->sum->replicate();
        $snapshot->percents += $this->penaltyPercents;
        $snapshot->main += $this->penaltyMain;
        $this->penaltyPercents -= $payment->money_sum->sum;
        if ($this->penaltyPercents < 0) {
            $this->penaltyMain += $this->penaltyPercents;
            $this->penaltyPercents = 0;
            if ($this->penaltyMain < 0) {
                $this->sum->penalties += $this->penaltyMain;
                $this->penaltyMain = 0;
                if($this->sum->penalties < 0) {
                    $this->sum->percents += $this->sum->penalties;
                    $this->sum->penalties = 0;
                    if($this->sum->percents < 0) {
                        $this->sum->main += $this->sum->percents;
                        $this->sum->percents = 0;
                    }
                }
            }
        }
        $payment->money_sum->percents = $snapshot->percents - $this->sum->percents - $this->penaltyPercents;
        $payment->money_sum->penalties = $snapshot->penalties - $this->sum->penalties;
        $payment->money_sum->main = $snapshot->main - $this->sum->main - $this->penaltyMain;
    }

    protected function countPercents(Carbon $startDate, Carbon $endDate): float
    {
        $result = 0;
        if($this->sum->main != 0) {
            $result = $this->getPercents($startDate, $endDate, $this->percent, $this->sum->main);
            $this->sum->percents += $result;
        }
        $penaltyResult = 0;
        if($this->penaltyMain != 0) $penaltyResult = $this->getPercents($startDate, $endDate, $this->percent, $this->penaltyMain);
        $this->setPenaltyPercents($penaltyResult + $this->penaltyPercents);
        return $result;
    }

    protected function countPenalties(Carbon $startDate, Carbon $endDate): float
    {
        if($this->penaltyMain != 0) {
            $result = $this->getPercents($startDate, $endDate, $this->penalty, $this->penaltyMain);
            $this->sum->penalties += $result;
            return $result;
        }
        return 0;
    }
    protected function countPercentsAndPenalties(Carbon $startDate, Carbon $endDate): void
    {
        $this->countPercents($startDate, $endDate);
        $this->countPenalties($startDate, $endDate);
    }

    protected function skipDaysOff(Carbon $date): void
    {
        if($date->dayOfWeek === 6) $date->addDays(2);
        if($date->dayOfWeek === 0) $date->addDay();
        if(Holiday::query()->where('date', $date->format(ISO_DATE_FORMAT))->first(['id'])) {
            $date->addDay();
            $this->skipDaysOff($date);
        }
    }
    protected function getPercents(Carbon $startDate, Carbon $endDate, float $percent, float $main): float
    {
        $days = $startDate->diffInDays($endDate);
        if($endDate->isLeapYear()) $daysInYear = 366;
        else $daysInYear = 365;
        return $main * $days / $daysInYear * $percent / 100;
    }
    protected function setPenaltyPercents(float $value)
    {
        $this->penaltyPercents = $this->roundMoney($value);
    }
    protected function setPenaltyMain(float $value)
    {
        $this->penaltyMain = $this->roundMoney($value);
    }
    protected function roundMoney(float $money): float
    {
        return round($money, 2);
    }

    protected function countAllByDueMonth(Carbon $startDate, Carbon $endDate): float
    {
        $result = $this->countPercents($startDate, $endDate);
        $this->countPenalties($startDate, $endDate);
        $this->setPenaltyPercents($this->penaltyPercents + $this->sum->percents);
        $this->penaltyMain += $this->month_due_sum;
        $this->sum->main -= $this->month_due_sum;
        $this->sum->percents = 0;
        return $result;
    }
    protected function countEnd(Carbon $startDate, Carbon $endDate): void
    {
        if($endDate >= $this->dueDate) {
            $this->countPercentsAndPenalties($startDate, $this->dueDate);
            $this->penaltyMain += $this->sum->main;
            $this->penaltyPercents += $this->sum->percents;
            $this->sum->main = 0;
            $this->sum->percents = 0;
            $this->countPercentsAndPenalties($this->dueDate, $endDate);
        }
        else {
            $this->countPercentsAndPenalties($startDate, $endDate);
        }
    }

}