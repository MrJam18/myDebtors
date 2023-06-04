<?php
declare(strict_types=1);

namespace App\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\Base\CountBreak;
use App\Services\Counters\Base\Limited;
use Carbon\Carbon;

class LimitedLoanCountService extends LoanCountService
{
    protected Limited $limited;
    protected Carbon $limitedDate;
    protected bool $isPercentsCounted = true;
    protected bool $endFlag = false;


    function count(Contract $contract, Carbon $endDate): MoneySum
    {
        $this->limited = new Limited($contract->issued_sum, $contract->issued_date);
        return parent::count($contract, $endDate);
    }

    protected function countLimitedDate(Carbon $currentDate): void
    {
        if ($this->sum->main == 0) {
            $this->limitedDate = $this->endDate;
            $this->limited->isLimited = false;
            return;
        }
        if ($this->limited->limit <= 0) {
            $this->limited->limit = 0;
            $this->limitedDate = $currentDate;
            return;
        }
        $countedDay = $this->sum->main / 365 * $this->percent / 100;
        if ($this->limited->isLimitedPenalty) {
            $countedDay += $this->sum->main / 365 * $this->penalty / 100;
        }
        $days = $this->limited->limit / $countedDay + 1;
        $this->limitedDate = $currentDate->clone()->addDays($days);
    }

    protected function countPeriod(Carbon $startDate, Carbon $endDate): void
    {
        if($this->limited->isLimited) {
            if($this->isPercentsCounted) {
                $this->countLimitedDate($startDate);
                $lastPercentsDate = $endDate;
                if ($endDate > $this->limitedDate) {
                    $lastPercentsDate = $this->limitedDate;
                    $this->endFlag = true;
                }
                $this->limited->limit -= $this->countPercents($startDate, $lastPercentsDate);
            }
            if (!$this->isPenaltiesCounted['ended']) {
                $endPenaltyDate = $this->endFlag ? $this->limitedDate : $endDate;
                $countedPenalties = $this->countPenaltiesPeriod($startDate, $endPenaltyDate);
                if ($this->limited->isLimitedPenalty) {
                    $this->limited->limit -= $countedPenalties;
                }
            }
            if ($this->endFlag) {
                $this->isPercentsCounted = false;
                if ($this->limited->isLimitedPenalty) {
                    $this->isPenaltiesCounted['ended'] = true;
                    $this->sum->percents = $this->limited->limitSum - $this->sum->penalties;
                    $this->addBreak($this->limitedDate);
                } else {
                    $this->sum->percents = $this->limited->limitSum;
                    $this->addBreak($this->limitedDate, null, true);
                    $this->countPenaltiesPeriod($this->limitedDate, $endDate);
                }
                $this->endFlag = false;
            }
        } else {
            $this->countPercents($startDate, $endDate);
            if ($this->isPenaltiesCounted['started']) {
                $this->countPenalties($startDate, $endDate);
            } else if ($endDate > $this->dueDate) {
                $this->countPenalties($this->dueDate, $endDate);
                $this->isPenaltiesCounted['started'] = true;
            }
        }
    }

    protected function addBreak(Carbon $date, Payment $payment = null, bool $noPenalty = false): void
    {
        $this->breaks->push(new CountBreak($date, $this->sum, $payment, $this->isPercentsCounted, $this->isPenaltiesCounted['ended'], $noPenalty));
    }




}