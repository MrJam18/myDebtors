<?php
declare(strict_types=1);

namespace App\Services\Excel\Writers;

use App\Enums\Database\ContractTypeEnum;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractStatus;
use App\Models\Contract\ContractType;
use App\Services\Excel\Base\ExcelCellSetter;
use App\Services\Excel\Base\ExcelWriterService;
use Illuminate\Support\Collection;

class ContractsExcelWriterService extends ExcelWriterService
{
    function handle(Collection $contracts)
    {
        $this->cellSetter->setColumnWidth('C', 5);
        $this->cellSetter->setColumnWidth('F', 5.88);
        $this->cellSetter->setColumnWidth('G', 5);
        $this->cellSetter->setColumnWidth('H', 3.6);
        $this->cellSetter->setColumnWidth('L', 6.54);
        $this->cellSetter->setColumnWidth('M', 7.2);
        $this->cellSetter->setRowAsHeader(14);
        $this->cellSetter->setHeaderAndNext('Ид. типа');
        $this->cellSetter->setHeaderAndNext('Ид. Статуса');
        $this->cellSetter->setHeaderAndNext('Номер');
        $this->cellSetter->setHeaderAndNext('Дата выдачи');
        $this->cellSetter->setHeaderAndNext('Сумма выдачи');
        $this->cellSetter->setHeaderAndNext('Дата исполнения');
        $this->cellSetter->setHeaderAndNext('процентная ставка (% год.)');
        $this->cellSetter->setHeaderAndNext('неустойка(% год.)');
        $this->cellSetter->setHeaderAndNext('Ид. Кредитора');
        $this->cellSetter->setHeaderAndNext('Ид. Должника');
        $this->cellSetter->setHeaderAndNext('Ид. Цессии');
        $this->cellSetter->setHeaderAndNext('Ежемес. Платеж (для кредитов)');
        $this->cellSetter->setHeaderAndNext('Дата ежемес. Платежа (для кредитов)');
        $this->cellSetter->setHeaderAndNext('Идентификатор');
        $this->cellSetter->nextRow();
        $contracts->each(function (Contract $contract) {
            $this->cellSetter->setCellAndNext($contract->type->id);
            $this->cellSetter->setCellAndNext($contract->status->id);
            $this->cellSetter->setCellAndNext($contract->number);
            $this->cellSetter->setDateCellAndNext($contract->issued_date);
            $this->cellSetter->setCellAndNext($contract->issued_sum);
            $this->cellSetter->setDateCellAndNext($contract->due_date);
            $this->cellSetter->setCellAndNext($contract->percent);
            $this->cellSetter->setCellAndNext($contract->penalty);
            $this->cellSetter->setCellAndNext($contract->creditor_id);
            $this->cellSetter->setCellAndNext($contract->debtor_id);
            $this->cellSetter->setCellAndNext($contract->cession_id);
            if($contract->type->id === ContractTypeEnum::Credit->value) {
                $this->cellSetter->setCellAndNext($contract->month_due_sum);
                $this->cellSetter->setCellAndNext($contract->month_due_date);
            }
            else {
                $this->cellSetter->setCellAndNext('');
                $this->cellSetter->setCellAndNext('');
            }
            $this->cellSetter->setCellAndNext($contract->id);
            $this->cellSetter->nextRow();
        });
        $typeSheet = $this->spreadsheet->createSheet();
        $typeSheet->setTitle('Ид. Типов');
        $typeSetter = new ExcelCellSetter($typeSheet);
        $typeSetter->setColumnWidth('B', 4.5);
        $typeSetter->setRowAsHeader(2);
        $typeSetter->setHeaderAndNext('Ид.');
        $typeSetter->setHeaderAndNext('Название');
        $typeSetter->nextRow();
        $types = ContractType::all();
        $types->each(function (ContractType $type) use($typeSetter) {
            $typeSetter->setCellAndNext($type->id);
            $typeSetter->setCellAndNext($type->name);
            $typeSetter->nextRow();
        });
        $statusSheet = $this->spreadsheet->createSheet();
        $statusSheet->setTitle('Ид. статусов');
        $statusSetter = new ExcelCellSetter($statusSheet);
        $statusSetter->setColumnWidth('B', 7.4);
        $statusSetter->setRowAsHeader(2);
        $statusSetter->setHeaderAndNext('Ид.');
        $statusSetter->setHeaderAndNext('Название');
        $statusSetter->nextRow();
        $statuses = ContractStatus::all();
        $statuses->each(function (ContractStatus $status) use($statusSetter) {
            $statusSetter->setCellAndNext($status->id);
            $statusSetter->setCellAndNext($status->name);
            $statusSetter->nextRow();
        });
        $this->spreadsheet->setActiveSheetIndex(0);
    }

}