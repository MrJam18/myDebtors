<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExcelCellGetter extends ExcelCellHelper
{
    protected Worksheet $activeSheet;
    protected int $row;
    protected int $column;
    protected int $initColumn;

    public function __construct(Worksheet $activeSheet, int $initColumn = 1, int $initRow = 2)
    {
        parent::__construct($activeSheet, $initColumn, $initRow);
    }

    function getValueAndNext(): mixed
    {
        $data = $this->activeSheet->getCell($this->getCell())->getValue();
        $this->column++;
        return $data;
    }
    function getFormattedValueAndNext(): string
    {
        $data = $this->activeSheet->getCell($this->getCell())->getFormattedValue();
        $this->column++;
        return $data;
    }

    function getDateAndNext(): Carbon
    {
        $value = $this->getFormattedValueAndNext();
        if(str_contains($value, '/')) return Carbon::createFromFormat('d/m/Y', $value);
        return Carbon::createFromFormat(RUS_DATE_FORMAT, $value);
    }

    /**
     * @param int $column
     */
    public function setColumn(int $column): void
    {
        $this->column = $column;
    }
    function checkValueExists(): bool
    {
        return (bool)$this->activeSheet->getCell($this->getCell())->getValue();
    }

}