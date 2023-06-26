<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExcelCellHelper
{
    protected int $column;
    protected int $row;
    protected int $initColumn;
    protected Worksheet $activeSheet;

    public function __construct(Worksheet $activeSheet, int $initColumn = 1, int $initRow = 1)
    {
        $this->activeSheet = $activeSheet;
        $this->column = $initColumn;
        $this->row = $initRow;
        $this->initColumn = $initColumn;
    }

    protected function getCell(): array
    {
        return [$this->column, $this->row];
    }

    function nextRow(): void
    {
        $this->row++;
        $this->column = $this->initColumn;
    }
}