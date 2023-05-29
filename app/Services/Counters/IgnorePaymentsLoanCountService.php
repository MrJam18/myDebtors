<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\MoneySum;
use App\Services\Counters\Base\Limited;
use Carbon\Carbon;

class IgnorePaymentsLoanCountService extends CountService
{
    protected Limited $limited;

//    public function __construct(Contract $contract, Carbon $endDate)
//    {
//        parent::__construct($contract, $endDate);
//
//    }


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
    function count(Contract $contract, Carbon $endDate): MoneySum
    {
        $this->limited = new Limited($contract->issued_sum, $contract->issued_date);
        $result = parent::count($contract, $endDate);
        $this->countLimitedPercents();
        return $result;
    }

    function getLimited(): Limited
    {
        return $this->limited;
    }
}