<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\Base\CountBreak;
use App\Services\Counters\Base\Limited;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class IgnorePaymentsLoanCountService extends LoanCountService
{
    protected Limited $limited;


    protected function countPeriod(Carbon $startDate, Carbon $endDate): void
    {
        $this->countPercents($startDate, $endDate);
        $this->countPenaltiesPeriod($startDate, $endDate);
    }
    private function countLimitedPercents()
    {
        $sum = $this->sum->percents;
        if($this->limited->isLimitedPenalty) $sum += $this->sum->penalties;
        if($this->limited->isLimited && $sum > $this->limited->limitSum) {
            $this->limited->setPercents($this->limited->isLimitedPenalty ? $this->limited->limitSum - $this->sum->penalties : $this->limited->limitSum);
        }
    }
    function count(Contract $contract, Carbon $endDate, ?Collection $payments = null): MoneySum
    {
        $this->limited = new Limited($contract->issued_sum, $contract->issued_date);
        $result = parent::count($contract, $endDate, $payments);
        $this->countLimitedPercents();
        return $result;
    }

    function getLimited(): Limited
    {
        return $this->limited;
    }

    protected function addBreak(Carbon $date, Payment $payment = null): void
    {
        $this->breaks->push(new CountBreak($date, $this->sum->replicate(), $payment));
    }
}