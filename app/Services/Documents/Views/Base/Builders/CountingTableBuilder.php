<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;

use App\Models\Contract\Payment;
use App\Models\MoneySum;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Row;
use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\SimpleType\Jc;
use PhpOffice\PhpWord\SimpleType\VerticalJc;

class CountingTableBuilder extends TableBuilder
{

    public function __construct(Section $section, MoneySum $sums, float $percent)
    {
        parent::__construct($section, $sums, $percent);
        $this->defaultCellStyle = [
            'marginLeft' => 100,
            'marginRight' => 100,
            'marginTop' => 100,
            'marginBottom' => 100,
            'vAlign' => VerticalJc::CENTER
        ];
        $this->defaultFontStyle = [
            'alignment' => Jc::END,
        ];
    }

    function addTableHeader(string $text): Text
    {
        $pStyle = [
            'indentation' => ['firstLine' => 800],
            'spaceAfter' => 150,
        ];
        return $this->section->addText($text, null, $pStyle);
    }
    function addHeaders(Collection $headers): Row
    {
        $cellStyle = $this->defaultCellStyle;
        $cellStyle['vAlign'] = VerticalJc::BOTTOM;
        $fontStyle = [
            'bold' => true,
            'alignment' => Jc::CENTER
        ];
        $defWidth = 1350;
        $row = $this->table->addRow(00);
        $this->addTextCell((string)$headers[0],$cellStyle,$fontStyle, width: 1000);
        $this->addTextCell($headers[1], $cellStyle,$fontStyle, width: $defWidth);
        $this->addTextCell($headers[2], $cellStyle,$fontStyle, width: $defWidth);
        $this->addTextCell($headers[3], $cellStyle,$fontStyle, width: 800);
        $this->addTextCell($headers[4], $cellStyle,$fontStyle, width: 2800);
        $this->addTextCell($headers[5], $cellStyle,$fontStyle, width: $defWidth);
        $this->addTextCell($headers[6], $cellStyle,$fontStyle, width: $defWidth);
        return $row;
    }
    function addPaymentRow(Payment $payment, float $percents): Row
    {
        $row = $this->table->addRow(500);
        $this->addTextCell('- ' . $payment->moneySum->main);
        $this->addTextCell($payment->date->format(RUS_DATE_FORMAT));
        $mergedCellStyle = $this->defaultCellStyle;
        $mergedCellStyle['gridSpan'] = 3;
        $this->addTextCell('Оплата долга', $mergedCellStyle);
        $this->addTextCell('- ' . $payment->moneySum->percents);
        $this->addTextCell('= ' . $percents);
        return $row;
    }
    function addCountRow(Carbon $startDate, Carbon $endDate, float $percentsInPeriod): Row
    {
        $daysInYear = $endDate->isLeapYear() ? 366 : 365;
        $days = $endDate->diffInDays($startDate) + 1;
        $cells = new Collection([
            (string)$this->sums->main,
            $startDate->format(RUS_DATE_FORMAT),
            $endDate->format(RUS_DATE_FORMAT),
            (string)$days,
            $this->sums->main . ' x ' . $days . ' / ' . $daysInYear . ' x ' . $this->percent . '%',
            '+ ' . $percentsInPeriod,
            '= ' . $this->sums->percents
        ]);
        return $this->addRow($cells);
    }

    function addNoCountRow(Carbon $firstDate, Carbon $lastDate): Row
    {
        $row = $this->table->addRow(500);
        $this->addTextCell((string)$this->sums->main);
        $this->addTextCell($firstDate->format(RUS_DATE_FORMAT));
        $this->addTextCell($lastDate->format(RUS_DATE_FORMAT));
        $mergedCellStyle = $this->defaultCellStyle;
        $mergedCellStyle['gridSpan'] = 3;
        $this->addTextCell('Не начисляются', $mergedCellStyle);
        $this->addTextCell('= ' . $this->sums->percents);
        return $row;
    }
    function addCountResult(string $text): Row
    {
        $mergedCellStyle = $this->defaultCellStyle;
        $mergedCellStyle['gridSpan'] = 7;
        $mergedCellStyle['vAlign'] = VerticalJc::CENTER;
        $row = $this->table->addRow(500);
        $this->addTextCell($text, $mergedCellStyle);
        return $row;
    }

}