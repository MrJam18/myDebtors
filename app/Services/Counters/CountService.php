<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use Carbon\Carbon;
use Illuminate\Support\Collection;

abstract class CountService
{
    protected float $percent;
    protected float $penalty;
    protected Carbon $startDate;
    protected Carbon $endDate;
    protected Years $years;
    protected float $issued;
    protected float $main;
    protected MoneySum $sum;
    protected Collection $breaks;
    protected bool $isPercentsCounted;
    protected bool $isPenaltiesCounted;
    protected float $percents;
    protected float $penalties;

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

    function count(): void
    {
        $this->addBreak($this->startDate);
        /**
         * @var Year $firstYear
         */
        $firstYear = $this->years->list->first();
        $lastYear = $this->years->getLastYear();
        if($lastYear) {
            $this->countYear($this->startDate, $firstYear->getLastDate(), $firstYear);
            $otherYears = $this->years->getMiddleYears();
            $otherYears->each(function (Year $year) {
                $lastPrevYearDate = $this->getLastYearDate($year->number - 1);
                if($this->breaks->last()->date->isLeapYear() !== $year->isLeap) {
                    $this->addBreak($lastPrevYearDate);
                }
                $this->countYear($lastPrevYearDate, $year->getLastDate(), $year);
            });
            $this->countYear($this->getLastYearDate($lastYear->number - 1), $this->endDate, $lastYear);
        }
        else $this->countYear($this->startDate, $this->endDate, $firstYear);
        $this->addBreak($this->endDate);
    }

    protected function addBreak(Carbon $date, Payment $payment = null): void
    {
        $this->breaks->push(new CountBreak($date, $this->sum->replicate(), $payment, $this->isPercentsCounted, $this->isPenaltiesCounted));
    }

    abstract protected function countPenalties(Carbon $startDate, Carbon $endDate): void;

    protected function countPercents(Carbon $startDate, Carbon $endDate): float
    {
        $counted = $this->getPercents($startDate, $endDate);
        $this->percents += $counted;
        return $counted;
    }

    protected function getPercents(Carbon $startDate, Carbon $endDate): float
    {
        $days = $startDate->diffInDays($endDate);
        if($startDate->isLeapYear()) $daysInYear = 366;
        else $daysInYear = 365;
        return $this->main * $days / $daysInYear * $this->percent / 100;
    }

    protected function countYear(Carbon $startDate, Carbon $endDate, Year $year): void
    {
        if(!$year->payments->isEmpty()) $this->countPeriod($startDate, $year->payments->first());
        else $this->countPeriod($startDate, $endDate);
        $year->payments->each(function (Payment $payment, int $index) use ($year, $endDate) {
            $this->addBreak($payment->date, $payment);
            $snapshot = new MoneySum();
            $snapshot->percents = $this->percents;
            $snapshot->penalties = $this->penalties;
            $snapshot->main = $this->main;
            $this->percents -= $payment->moneySum->sum;
            if ($this->percents < 0) {
                $this->main += $this->percents;
                $this->percents = 0;
                if($this->main < 0) {
                    $this->penalties += $this->main;
                    $this->main = 0;
                }
            }
            $payment->moneySum->percents = $snapshot->percents - $this->percents;
            $payment->moneySum->penalties = $snapshot->penalties - $this->penalties;
            $payment->moneySum->main = $snapshot->main - $this->main;
            if (isset($year->payments[$index + 1])) $this->countPeriod($payment->date, $year->payments[$index + 1]->date);
            else $this->countPeriod($payment->date, $endDate);
        });
    }

    protected function getLastYearDate(int $year): Carbon
    {
        return Carbon::createFromFormat(ISO_DATE_FORMAT, $year . '-12-31');
    }

    abstract protected function countPeriod(Carbon $startDate, Carbon $endDate): void;
}