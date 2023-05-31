<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\ContractType;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\Base\CountBreak;
use App\Services\Counters\Base\Year;
use App\Services\Counters\Base\Years;
use Carbon\Carbon;
use Illuminate\Support\Collection;

abstract class CountService
{
    protected float $percent;
    protected float $penalty;
    protected Carbon $startDate;
    protected Carbon $endDate;
    protected Carbon $dueDate;
    protected Years $years;
    protected float $issued;
    protected MoneySum $sum;
    protected Collection $breaks;
    protected bool $isPercentsCounted;
    protected array $isPenaltiesCounted = [
        'started' => false,
        'ended' => false
    ];
    protected float $fee;

    function count(Contract $contract, Carbon $endDate): MoneySum
    {
        $this->percent = $contract->percent;
        $this->penalty = $contract->penalty;
        $this->startDate = $contract->issued_date;
        $this->endDate = $endDate;
        $this->dueDate = $contract->due_date;
        $this->issued = $contract->issued_sum;
        $this->sum = new MoneySum();
        $this->breaks = new Collection();
        $this->sum->main = $contract->issued_sum;
        $this->sum->percents = 0;
        $this->sum->penalties = 0;
        $this->years = new Years($this->startDate, $this->endDate, $contract->payments);
        $this->isPenaltiesCounted = [
            'started' => false,
            'ended' => false
        ];
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
        return $this->sum;
    }

    protected function addBreak(Carbon $date, Payment $payment = null): void
    {
        $this->breaks->push(new CountBreak($date, $this->sum->replicate(), $payment));
    }

//    protected function countPercents(Carbon $startDate, Carbon $endDate): float
//    {
//        $counted = $this->getPercents($startDate, $endDate, $this->percent);
//        $this->sum->percents += $counted;
//        return $counted;
//    }


    protected function getLastYearDate(int $year): Carbon
    {
        return  new Carbon($year . '-12-31');
    }

    public function countFee(ContractType $type): float
    {
        $fee = 0;
        $moneySum = $this->sum;
        if(!$this->sum->sum) $this->sum->countSum();
        if($this->sum->sum <= 20000) {
            $fee = $moneySum->sum / 100 * 4;
            if($fee < 400) {
                $fee = 400;
            }
        } else if(($moneySum->sum > 20000) && ($moneySum->sum <= 100000)) {
            $fee = (($moneySum->sum - 20000) / 100 * 3) + 800;
        } else if(($moneySum->sum > 100000) && ($moneySum->sum <= 200000)) {
            $fee = (($moneySum->sum - 100000) / 100 * 2) + 3200;
        } else if(($moneySum->sum > 200000) && ($moneySum->sum <= 1000000)) {
            $fee = (($moneySum->sum - 200000) / 100) + 5200;
        } else {
            $fee = (($moneySum->sum - 1000000) / 100 * 0.5) + 13200;
            if ($fee > 60000) {
                $fee = 60000;
            }
        }
        if($type->name === "Судебный приказ") {
            $fee = $fee / 2;
        }
        $this->fee = $fee;
        return $this->fee;
    }
//    protected function countPenalties(Carbon $startDate, Carbon $endDate): float
//    {
//        $counted = $this->getPercents($startDate, $endDate, $this->penalty);
//        $this->sum->penalties += $counted;
//        return $counted;
//    }
//    protected function countPenaltiesPeriod($startDate, $endDate): float {
//        $counted = 0;
//        if ($this->isPenaltiesCounted['started']) {
//            $counted = $this->countPenalties($startDate, $endDate);
//        } elseif ($endDate > $this->dueDate) {
//            $this->isPenaltiesCounted['started'] = true;
//            $counted = $this->countPenalties($this->dueDate, $endDate);
//        }
//        return $counted;
//    }

    static function getResult(Contract $contract, Carbon $endDate): MoneySum
    {
        return (new static())->count($contract, $endDate);
    }

    protected function countYear(Carbon $startDate, Carbon $endDate, Year $year): void
    {
        if(!$year->payments->isEmpty()) $this->countPeriod($startDate, $year->payments->first()->date);
        else $this->countPeriod($startDate, $endDate);
        $year->payments->each(function (Payment $payment, int $index) use ($year, $endDate) {
            $this->addBreak($payment->date, $payment);
            $this->countPayment($payment);
            if (isset($year->payments[$index + 1])) $this->countPeriod($payment->date, $year->payments[$index + 1]->date);
            else $this->countPeriod($payment->date, $endDate);
        });
    }
    public function getBreaks(): Collection
    {
        return $this->breaks;
    }
    abstract protected function countPercents(Carbon $startDate, Carbon $endDate): float;
    abstract protected function countPenalties(Carbon $startDate, Carbon $endDate): float;
//    abstract protected function countPenaltiesPeriod(Carbon $startDate, Carbon $endDate): float;
    abstract protected function countPeriod(Carbon $startDate, Carbon $endDate): void;
    abstract protected function countPayment(Payment $payment): void;

}