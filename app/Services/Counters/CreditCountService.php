<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\Holiday;
use App\Models\MoneySum;
use App\Services\Counters\Base\CountBreak;
use App\Services\Counters\Base\PenaltyBreak;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CreditCountService extends CountService
{
    protected int $month_due_date;
    protected float $month_due_sum;
    protected float $penaltyMain = 0;
    protected float $penaltyPercents = 0;
    protected float $percents = 0;
    protected float $penalties = 0;
    protected Collection $penaltyBreaks;


    function count(Contract $contract, Carbon $endDate, ?Collection $payments = null): MoneySum
    {
        $this->penaltyBreaks = new Collection();
        $this->month_due_date = $contract->month_due_date;
        $this->month_due_sum = $contract->month_due_sum;
        return parent::count($contract, $endDate, $payments);
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
        $snapshot = [
            'main' => $this->sum->main,
            'percents' => $this->percents,
            'penalties' => $this->penalties
        ];
        $snapshot['percents'] += $this->penaltyPercents;
        $snapshot['main'] += $this->penaltyMain;
        $this->penaltyPercents -= $payment->moneySum->sum;
        if ($this->penaltyPercents < 0) {
            $this->penaltyMain += $this->penaltyPercents;
            $this->penaltyPercents = 0;
            if ($this->penaltyMain < 0) {
                $this->penalties += $this->penaltyMain;
                $this->penaltyMain = 0;
                if($this->penalties < 0) {
                    $this->percents += $this->penalties;
                    $this->penalties = 0;
                    if($this->percents < 0) {
                        $this->sum->main += $this->percents;
                        $this->percents = 0;
                    }
                }
            }
        }
        $payment->moneySum->percents = $snapshot['percents'] - $this->percents - $this->penaltyPercents;
        $payment->moneySum->penalties = $snapshot['penalties'] - $this->penalties;
        $payment->moneySum->main = $snapshot['main'] - $this->sum->main - $this->penaltyMain;
    }

    protected function countPercents(Carbon $startDate, Carbon $endDate): float
    {
        $result = 0;
        if($this->sum->main != 0) {
            $result = $this->getPercents($startDate, $endDate, $this->percent, $this->sum->main);
            $this->percents += $result;
        }
        $penaltyResult = 0;
        if($this->penaltyMain != 0) $penaltyResult = $this->getPercents($startDate, $endDate, $this->percent, $this->penaltyMain);
        $this->penaltyPercents += $penaltyResult;
        return $result;
    }

    protected function countPenalties(Carbon $startDate, Carbon $endDate): float
    {
        if($this->penaltyMain != 0) {
            $result = $this->getPercents($startDate, $endDate, $this->penalty, $this->penaltyMain);
            $this->penalties += $result;
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

    protected function countAllByDueMonth(Carbon $startDate, Carbon $endDate): float
    {
        $result = $this->countPercents($startDate, $endDate);
        $this->countPenalties($startDate, $endDate);
        $this->penaltyPercents += $this->percents;
        if($this->sum->main != 0) {
            $this->penaltyMain += $this->month_due_sum;
            $this->sum->main -= $this->month_due_sum;
            if($this->sum->main < 0) {
                $this->penaltyMain += $this->sum->main;
                $this->sum->main = 0;
            }
            $this->addPenaltyBreak($endDate);
        }
        $this->percents = 0;
        return $result;
    }
    protected function countEnd(Carbon $startDate, Carbon $endDate): void
    {
        if($startDate >= $this->dueDate && $endDate <= $this->dueDate) {
            $this->countPercentsAndPenalties($startDate, $this->dueDate);
            $this->penaltyMain += $this->sum->main;
            $this->penaltyPercents += $this->percents;
            $this->sum->main = 0;
            $this->percents = 0;
            $this->addPenaltyBreak($this->dueDate);
            $this->countPercentsAndPenalties($this->dueDate, $endDate);
        }
        else {
            $this->countPercentsAndPenalties($startDate, $endDate);
        }
    }

    protected function addBreak(Carbon $date, Payment $payment = null): void
    {
        $result = $this->getResult();
        $this->breaks->push(new CountBreak($date, $result, $payment));
        if(!($payment && $payment->moneySum->main == 0 && $payment->moneySum->penalties == 0)) {
            $this->addPenaltyBreak($date, $payment);
        }
    }
    protected function addPenaltyBreak(Carbon $date, ?Payment $payment = null)
    {
        $sum = new MoneySum();
        $sum->main = $this->penaltyMain;
        $sum->penalties = $this->penalties;
        $this->penaltyBreaks->push(new PenaltyBreak($date, $sum, $payment));
    }
    public function getResult(): MoneySum
    {
        $sum = new MoneySum();
        $sum->percents = $this->penaltyPercents + $this->percents;
        $sum->main = $this->penaltyMain + $this->sum->main;
        $sum->penalties = $this->penalties;
        $sum->countSum();
        return $sum;
    }
    public function getPenaltyBreaks(): Collection
    {
        return $this->penaltyBreaks;
    }
}