<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

abstract class ExcelReaderService extends ExcelService
{
    protected ExcelCellGetter $getter;
    protected int $lastRow;

    public function __construct(Spreadsheet $spreadsheet, int $initColumn = 1, int $initRow = 2)
    {
        parent::__construct($spreadsheet);
        $this->getter = new ExcelCellGetter($this->activeSheet, $initColumn, $initRow);
        $this->lastRow = $this->activeSheet->getHighestRow();
    }

    static function createFromPath(string $path, int $initColumn = 1, int $initRow = 2): static
    {
        $spreadSheet = IOFactory::load($path);
        return new static($spreadSheet, $initColumn, $initRow);
    }

    protected function handleEachRow(callable $callback)
    {
        for($row = 2; $row <= $this->lastRow; $row++) {
            $returned = $callback($this->getter);
            if($returned === false) break;
            if(!$this->getter->checkValueExists()) break;
        }
    }

    abstract protected function handler(ExcelCellGetter $getter): void;

    function handle()
    {
        $this->handler($this->getter);
    }

}