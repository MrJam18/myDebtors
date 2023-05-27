<?php
declare(strict_types=1);

namespace App\Services\Counters;


use Carbon\Carbon;
use Illuminate\Support\Collection;

class Year
{
    public bool $isLeap;

    public function __construct(
        public int $number,
        public Collection $payments
    )
    {
       $this->isLeap = $this->number % 4 === 0;
    }

    function getLastDate(): Carbon
    {
        return Carbon::createFromFormat(ISO_DATE_FORMAT, $this->number . '-12-31');
    }

}