<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\CountingTables;

use App\Models\Contract\Contract;
use App\Services\Counters\Base\CountBreak;
use App\Services\Documents\Base\Builders\CountingTableBuilder;
use App\Services\Documents\Views\Base\CountingTable;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

class CountingPercentsTable extends CountingTable
{
    public function __construct(Section $section, Contract $contract, Collection $countBreaks)
    {
        parent::__construct($section, $contract, $countBreaks);
        $this->builder = new CountingTableBuilder($section, $this->sums, $contract->percent);
    }


    protected function buildTable(CountingTableBuilder $builder): void
    {
        $builder->addTableHeader('Расчет процентов и основного долга:');
        $builder->setTable($this->section->addTable());
        $headers = new Collection([
            'Осн. долг',
            'С',
            'По',
            "Дней",
            "Формула",
            "Проценты за период",
            "Сумма процентов"
        ]);
        $builder->addHeaders($headers);
        $this->countBreaks->each(function (CountBreak $break, int $index) use ($builder) {
            if(isset($this->countBreaks[$index + 1])) {
                /**
                 * @var CountBreak $next;
                 */
                $next = $this->countBreaks[$index + 1];
                if($break->payment) {
                    $payment = $break->payment;
                    $this->sums->main -= $payment->money_sum->main;
                    $this->sums->percents -= $payment->money_sum->percents;
                    $builder->addPaymentRow($payment, $this->sums->percents);
                }
                $firstDate = ($break->date->clone())->addDay();
                if($break->isPercentsCounted) {
                    $percentsInPeriod = $next->sum->percents - $this->sums->percents;
                    $this->sums->percents = $next->sum->percents;
                    $builder->addCountRow($firstDate, $next->date, $percentsInPeriod);
                }
                else $builder->addNoCountRow($firstDate, $next->date);
            }
        });
        $builder->addCountResult('Сумма процентов: ' . $this->sums->percents . ' руб.');
        $builder->addCountResult('Сумма основного долга: ' . $this->sums->main . ' руб.');

    }

}