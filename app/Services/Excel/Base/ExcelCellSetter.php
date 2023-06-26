<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Style;
use PhpOffice\PhpSpreadsheet\Worksheet\ColumnDimension;

class ExcelCellSetter extends ExcelCellHelper
{
    function setCellAndNext(mixed $value): void
    {
        $cell = $this->getCell();
        $this->activeSheet->setCellValue($cell, $value);
        $this->activeSheet->getStyle($cell)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
        $this->column++;
    }
    function setHeaderAndNext(string $value): void
    {
        $cell = $this->getCell();
        $this->activeSheet->setCellValue($cell, $value);
        $this->activeSheet->getStyle($cell)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_MEDIUM);
        $this->column++;

    }
    function setDateCellAndNext(Carbon $date): void
    {
        $cell = $this->getCell();
        $date = Date::PHPToExcel($date);
        $this->activeSheet->setCellValue($cell, $date);
        $this->activeSheet->getStyle([$this->column, $this->row])->getNumberFormat()
            ->setFormatCode('dd.mm.yyyy');
        $this->column++;
        $this->activeSheet->getStyle($cell)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
    }
    function setRowAsHeader(int $columnsCount): Style
    {
        $styles = $this->activeSheet->getStyle([$this->column, $this->row, $this->column + $columnsCount, $this->row]);
        $styles->getFont()->setBold(true);
        $styles->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        return $styles;
    }
    function setColumnWidth(string $column, float $width): ColumnDimension
    {
        return $this->activeSheet->getColumnDimension($column)->setWidth($width, 'cm');
    }

    function createIdNameHeaders()
    {
        $this->setColumnWidth('B', 6);
        $this->setRowAsHeader(2);
        $this->setHeaderAndNext('Ид.');
        $this->setHeaderAndNext('Название');
        $this->nextRow();
    }
    function setColumn(int $column)
    {
        for($currentColumn = $this->column; $currentColumn < $column; $currentColumn++) {
            $this->setCellAndNext('');
        }
        $this->column = $column;
    }

}