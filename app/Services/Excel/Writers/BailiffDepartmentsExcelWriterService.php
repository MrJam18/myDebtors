<?php
declare(strict_types=1);

namespace App\Services\Excel\Writers;

use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Services\Excel\Base\ExcelWriterService;
use Illuminate\Support\Collection;

class BailiffDepartmentsExcelWriterService extends ExcelWriterService
{
    function handle(Collection $departments)
    {
        $setter = $this->cellSetter;
        $this->cellSetter->setColumnWidth('A', 8);
        $this->cellSetter->setColumnWidth('B', 10);
        $setter->setRowAsHeader(3);
        $setter->setHeaderAndNext('Название  отдела');
        $setter->setHeaderAndNext('Адрес');
        $setter->setHeaderAndNext('Идентификатор');
        $setter->nextRow();
        $departments->each(function (BailiffDepartment $department) use ($setter) {
            $setter->setCellAndNext($department->name);
            $setter->setCellAndNext($department->address->getFull());
            $setter->setCellAndNext($department->id);
            $setter->nextRow();
        });
    }
}