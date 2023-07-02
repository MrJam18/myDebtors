<?php
declare(strict_types=1);

namespace App\Services\Excel\Writers;

use App\Models\Subject\People\Debtor;
use App\Services\Excel\Base\ExcelWriterService;
use Illuminate\Support\Collection;

class DebtorsExcelWriterService extends ExcelWriterService
{
    function buildSpreadSheet(Collection $debtors): void {
        $this->activeSheet->getColumnDimension('D')->setWidth(120, 'px');
        $this->activeSheet->getColumnDimension('E')->setWidth(150, 'px');
        $this->activeSheet->getColumnDimension('F')->setWidth(400, 'px');
        $this->activeSheet->getColumnDimension('G')->setWidth(120, 'px');
        $this->activeSheet->getColumnDimension('H')->setWidth(120, 'px');
        $this->cellSetter->setRowAsHeader(9);
        $this->cellSetter->setHeaderAndNext('Фамилия');
        $this->cellSetter->setHeaderAndNext('Имя');
        $this->cellSetter->setHeaderAndNext('Отчество');
        $this->cellSetter->setHeaderAndNext('Дата рождения');
        $this->cellSetter->setHeaderAndNext('Место Рождения');
        $this->cellSetter->setHeaderAndNext('Адрес');
        $this->cellSetter->setHeaderAndNext('Серия паспорта');
        $this->cellSetter->setHeaderAndNext('Номер паспорта');
        $this->cellSetter->setHeaderAndNext('Идентификатор');
        $this->cellSetter->nextRow();
        $debtors->each(function (Debtor $debtor) {
            $this->cellSetter->setCellAndNext($debtor->name->surname);
            $this->cellSetter->setCellAndNext($debtor->name->name);
            $this->cellSetter->setCellAndNext($debtor->name->patronymic);
            $this->cellSetter->setDateCellAndNext($debtor->birth_date);
            $this->cellSetter->setCellAndNext($debtor->birth_place);
            $this->cellSetter->setCellAndNext($debtor->address->getFull());
            $this->cellSetter->setCellAndNext($debtor->passport->series);
            $this->cellSetter->setCellAndNext($debtor->passport->number);
            $this->cellSetter->setCellAndNext($debtor->id);
            $this->cellSetter->nextRow();
        });
    }

}