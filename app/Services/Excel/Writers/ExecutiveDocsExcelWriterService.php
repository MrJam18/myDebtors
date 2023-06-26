<?php
declare(strict_types=1);

namespace App\Services\Excel\Writers;

use App\Enums\Database\ExecutiveDocTypeEnum;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\ExecutiveDocument\ExecutiveDocumentType;
use App\Services\Excel\Base\ExcelCellSetter;
use App\Services\Excel\Base\ExcelWriterService;
use Illuminate\Support\Collection;

class ExecutiveDocsExcelWriterService extends ExcelWriterService
{
    function handle(Collection $executiveDocs)
    {
        $this->cellSetter->setColumnWidth('B', 4);
        $this->cellSetter->setColumnWidth('D', 6.5);
        $this->cellSetter->setColumnWidth('E', 7);
        $this->cellSetter->setColumnWidth('K', 6.3);
        $this->cellSetter->setColumnWidth('L', 6.6);
        $this->cellSetter->setRowAsHeader(13);
        $this->cellSetter->setHeaderAndNext('Дата выдачи');
        $this->cellSetter->setHeaderAndNext('Номер');
        $this->cellSetter->setHeaderAndNext('Ид. типа');
        $this->cellSetter->setHeaderAndNext('Дата решения (для исп. листов)');
        $this->cellSetter->setHeaderAndNext('Номер решения (для исп. Листов)');
        $this->cellSetter->setHeaderAndNext('Осн. Долг');
        $this->cellSetter->setHeaderAndNext('Проценты');
        $this->cellSetter->setHeaderAndNext('Неустойка');
        $this->cellSetter->setHeaderAndNext('Госпошлина');
        $this->cellSetter->setHeaderAndNext('Ид. договора');
        $this->cellSetter->setHeaderAndNext('Ид. Суда, вынесшего решения');
        $this->cellSetter->setHeaderAndNext('Ид. Отдела судебных приставов');
        $this->cellSetter->setHeaderAndNext('Идентификатор');
        $this->cellSetter->nextRow();
        $executiveDocs->each(function (ExecutiveDocument $executiveDoc) {
            $this->cellSetter->setDateCellAndNext($executiveDoc->issued_date);
            $this->cellSetter->setCellAndNext($executiveDoc->number);
            $this->cellSetter->setCellAndNext($executiveDoc->type->id);
            if($executiveDoc->type->id === ExecutiveDocTypeEnum::ReceivingOrder->value) {
                $this->cellSetter->setDateCellAndNext($executiveDoc->resolution_date);
                $this->cellSetter->setCellAndNext($executiveDoc->resolution_number);
            }
            else {
                $this->cellSetter->setCellAndNext('');
                $this->cellSetter->setCellAndNext('');
            }
            $sums = $executiveDoc->moneySum;
            $this->cellSetter->setCellAndNext($sums->main);
            $this->cellSetter->setCellAndNext($sums->percents);
            $this->cellSetter->setCellAndNext($sums->penalties);
            $this->cellSetter->setCellAndNext($executiveDoc->fee);
            $this->cellSetter->setCellAndNext($executiveDoc->contract_id);
            $this->cellSetter->setCellAndNext($executiveDoc->court_id);
            $this->cellSetter->setCellAndNext($executiveDoc->bailiff_department_id);
            $this->cellSetter->setCellAndNext($executiveDoc->id);
            $this->cellSetter->nextRow();
        });
        $typeSheet = $this->spreadsheet->createSheet();
        $typeSheet->setTitle('Ид. типов');
        $typeSetter = new ExcelCellSetter($typeSheet);
        $typeSetter->createIdNameHeaders();
        $types = ExecutiveDocumentType::all();
        $types->each(function (ExecutiveDocumentType $type) use ($typeSetter) {
            $typeSetter->setCellAndNext($type->id);
            $typeSetter->setCellAndNext($type->name);
            $typeSetter->nextRow();
        });
        $this->spreadsheet->setActiveSheetIndex(0);
    }
}