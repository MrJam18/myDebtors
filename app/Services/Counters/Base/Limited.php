<?php
declare(strict_types=1);

namespace App\Services\Counters\Base;

use Carbon\Carbon;

class Limited {
//    public float $sum;
    public ?float $limit;
    public ?float $limitSum;
    public  bool $isLimitedPenalty;
    private float $percents = 0;
    public string $text;
    public bool $isLimitedPercents = true;
    public bool $isLimited = true;
    private Carbon $issuedDate;

    public function __construct(float|int $issued, Carbon $issuedDate) {
        $this->issuedDate = $issuedDate;
        if($this->issuedDate < '2016-03-28') {
            $this->limit = null;
            $this->isLimitedPenalty = false;
            $this->isLimitedPercents = false;
            $this->isLimited = false;
        }
        else if($this->compareIssuedDate('2016-03-28', '2016-12-31')) {
            $this->limit = $issued * 4;
            $this->isLimitedPenalty = false;
        }
        else if($this->compareIssuedDate('2016-12-31', '2019-01-27')) {
            $this->limit = $issued * 3;
            $this->isLimitedPenalty = false;
        }
        else if($this->compareIssuedDate('2019-01-27', '2019-06-30')) {
            $this->limit = $issued * 2.5;
            $this->isLimitedPenalty = true;
        }
        else if($this->compareIssuedDate('2019-06-30', '2019-12-31')) {
            $this->limit = $issued * 2;
            $this->isLimitedPenalty = true;
        }
        else {
            $this->limit = $issued * 1.5;
            $this->isLimitedPenalty = true;
        }
        $this->limitSum = $this->limit;
    }

    private function compareIssuedDate(string $firstDate, string $lastDate): bool
    {
        return ($this->issuedDate >= new Carbon($firstDate)) && ($this->issuedDate < new Carbon($lastDate));
    }

    public function getPercents(): float {
        return $this->percents;
    }

    public function setPercents($val): void {
        $this->percents = getRubles($val);
    }

    public function countLimitedPercents(float $percents, float $penalties): void {
    $sum = $percents;
    $this->percents = $percents;
    if($this->isLimitedPenalty) {
        $sum += $penalties;
    }
    if($this->isLimited && $sum > $this->limitSum) {
        $this->percents = $this->isLimitedPenalty ? $this->limitSum - $penalties : $this->limitSum;
        $this->setText();
        }
    }
    public function setText(): void {
        $this->text = 'Однако, в соответствии с ограничениями, введенными Федеральным законом от 02.07.2010 N 151-ФЗ, Федеральным законом от 27.12.2018 N 554-ФЗ "О внесении изменений в Федеральный закон "О потребительском кредите (займе)" и Федеральный закон "О микрофинансовой деятельности и микрофинансовых организациях" сумма процентов составляет ' . $this->percents . ' руб.;';
    }
}