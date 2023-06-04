<?php
declare(strict_types=1);

namespace App\Services\Counters\Base;

use App\Models\Contract\Payment;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class Years
{

    public Collection $list;

    /**
     * @param Carbon $firstDate
     * @param Carbon $lastDate
     * @param Collection $payments sorted by date payments
     */
    public function __construct(Carbon $firstDate, Carbon $lastDate, Collection $payments)
    {
        $this->list = new Collection();
        $firstYear = $firstDate->year;
        $lastYear = $lastDate->year;
        for($year = $firstYear; $year <= $lastYear; $year++) {
            $yearPayments = new Collection();
            $removedSlice = 0;
            $payments->each(function (Payment $payment, int $key) use ($year, &$yearPayments, &$removedSlice) {
                if($payment->date->year === $year) {
                    $yearPayments->push($payment);
                }
                else {
                    $removedSlice = $key;
                    return false;
                }
                return true;
            });
            $payments = $payments->slice($removedSlice);
            $this->list->push(new Year($year, $yearPayments));
        }
    }
    public function getMiddleYears(): Collection
    {
        if($this->list->count() < 3) return new Collection();
        return $this->list->except([0, $this->list->count() - 1]);
    }
    public function getLastYear(): ?Year
    {
        if($this->list->count() > 1) return $this->list->last();
        else return null;
    }

}