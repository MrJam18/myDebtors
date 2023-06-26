<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use PhpOffice\PhpSpreadsheet\Spreadsheet;

abstract class ExcelWriterService extends ExcelService
{
    protected ExcelCellSetter $cellSetter;
    public function __construct(?Spreadsheet $spreadsheet = null, int $initRow = 1, int $initColumn = 1 )
    {
        parent::__construct($spreadsheet);
        $this->cellSetter = new ExcelCellSetter($this->activeSheet, $initColumn, $initRow);
        $this->activeSheet->getDefaultColumnDimension()->setWidth(130, 'px');
        $this->activeSheet->getDefaultColumnDimension()->setAutoSize(true);
    }


}