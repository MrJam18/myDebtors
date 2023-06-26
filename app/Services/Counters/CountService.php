<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\ContractType;
use App\Models\Contract\Payment;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\EnforcementProceeding\EnforcementProceeding;
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
    protected ContractType $contractType;
    protected bool $isCurrentYearLeap;
    protected Collection $payments;

    function count(Contract $contract, Carbon $endDate, ?Collection $payments = null): MoneySum
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
        $this->contractType = $contract->type;
        if(!$payments) $payments = $contract->payments()->orderBy('date')->get();
        $this->payments = $payments;
        $this->years = new Years($this->startDate, $this->endDate, $payments);
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
            $this->isCurrentYearLeap = $firstYear->isLeap;
            $this->countYear($this->startDate, $firstYear->getLastDate(), $firstYear);
            $otherYears = $this->years->getMiddleYears();
            $otherYears->each(function (Year $year) {
                $lastPrevYearDate = $this->getLastYearDate($year->number - 1);
                if($this->isCurrentYearLeap !== $year->isLeap) {
                    $this->isCurrentYearLeap = $year->isLeap;
                    $this->addBreak($lastPrevYearDate);
                }
                $this->countYear($lastPrevYearDate, $year->getLastDate(), $year);
            });
            $this->countYear($this->getLastYearDate($lastYear->number - 1), $this->endDate, $lastYear);
        }
        else $this->countYear($this->startDate, $this->endDate, $firstYear);
        $this->addBreak($this->endDate);
        $this->sum->countSum();
        return $this->getResult();
    }

    abstract protected function addBreak(Carbon $date, Payment $payment = null): void;


    protected function getLastYearDate(int $year): Carbon
    {
        return  new Carbon($year . '-12-31');
    }

    protected function countFee(CourtClaimType $claimType): float
    {
        $moneySum = $this->getResult();
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
        if($claimType->id === 1) {
            $fee = $fee / 2;
        }
        $this->fee = round($fee, 2);
        return $this->fee;
    }
    function getResult(): MoneySum
    {
        return $this->sum->replicate();
    }

    function getFee(CourtClaimType $claimType): float {
        if(!isset($this->fee)) return $this->countFee($claimType);
        return $this->fee;
    }

    static function staticCount(Contract $contract, Carbon $endDate): MoneySum
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
    public function savePayments(): void
    {
        $proceedings = new Collection();
        $this->payments->each(function(Payment $payment) use ($proceedings) {
            $payment->moneySum->save();
            if($payment->enforcementProceeding) {
                $proceeding = $payment->enforcementProceeding;
                $sums = $payment->moneySum;
                if(!isset($proceedings[$proceeding->id])) {
                    $proceedings[$proceeding->id] = $proceeding;
                    $proceeding->sum = 0;
                    $proceeding->main = 0;
                    $proceeding->percents = 0;
                    $proceeding->penalties = 0;
                }
                $proceeding->sum += $sums->sum;
                $proceeding->main += $sums->main;
                $proceeding->percents += $proceeding->percents;
                $proceeding->penalties += $proceeding->penalties;
            }
        });
        $proceedings->each(fn (EnforcementProceeding $proceeding) => $proceeding->save());
    }
    abstract protected function countPercents(Carbon $startDate, Carbon $endDate): float;
    abstract protected function countPenalties(Carbon $startDate, Carbon $endDate): float;
    abstract protected function countPeriod(Carbon $startDate, Carbon $endDate): void;
    abstract protected function countPayment(Payment $payment): void;

}