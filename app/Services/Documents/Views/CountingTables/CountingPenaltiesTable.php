<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\CountingTables;

use App\Models\Contract\Contract;
use App\Services\Counters\Base\CountBreak;
use App\Services\Documents\Views\Base\Builders\CountingTableBuilder;
use App\Services\Documents\Views\Base\CountingTable;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

class CountingPenaltiesTable extends CountingTable
{
    public function __construct(Section $section, Contract $contract, Collection $countBreaks)
    {
        parent::__construct($section, $contract, $countBreaks);
        $this->builder = new CountingTableBuilder($section, $this->sums, $contract->penalty);
    }

    protected function buildTable(CountingTableBuilder $builder): void
    {
        $builder->addTableHeader('Расчет неустойки:');
        $builder->setTable($this->section->addTable());
        $headers = new Collection([
            'Осн. долг',
            "С",
            "По",
            "Дней",
            "Формула",
            "Неустойка за период",
            "Сумма неустойки"
        ]);
        $builder->addHeaders($headers);
        $this->countBreaks->each(function (CountBreak $break, int $index) {
            if($this->contract->due_date > $break->date) {
                if($break->payment?->moneySum->main != 0) $this->sums->main -= $break->payment->moneySum->main;
            }
            else {
                $this->countBreaks->splice(0, $index);
                return false;
            }
            return true;
        });
        $penaltyBreak = new CountBreak($this->contract->due_date, $this->sums);
        $this->countBreaks->prepend($penaltyBreak);
        $this->countBreaks = $this->countBreaks->each(function (CountBreak $break, int $index) use ($builder){
            if($break->payment && $break->payment->moneySum->main == 0 && $break->payment->moneySum->penalties == 0 || $break->isNoPenalty) {
                return true;
            }
            if(isset($this->countBreaks[$index + 1])) {
                /**
                 * @var CountBreak $next;
                 */
                $next = $this->countBreaks[$index + 1];
                if($break->payment) {
                    $paymentSum = $break->payment->moneySum;
                    $this->sums->main -= $paymentSum->main;
                    $this->sums->percents -= $paymentSum->penalties;
                    $builder->addPaymentRow($break->payment, $paymentSum->penalties);
                }
                $firstDate = $break->date->clone()->addDay();
                if($break->isPenaltiesCounted) {
                    $penaltiesInPeriod = $next->sum->penalties - $this->sums->penalties;
                    $this->sums->percents = $next->sum->penalties;
                    $builder->addCountRow($firstDate, $next->date, $penaltiesInPeriod);
                }
                else $builder->addNoCountRow($firstDate, $next->date);
            }
            return true;
        });
        $builder->addCountResult('Сумма неустойки: ' . $this->sums->percents . ' руб.');

    }
}