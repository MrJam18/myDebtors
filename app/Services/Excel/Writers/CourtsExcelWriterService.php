<?php
declare(strict_types=1);

namespace App\Services\Excel\Writers;

use App\Models\Contract\ContractType;
use App\Models\Subject\Court\Court;
use App\Models\Subject\Court\CourtLevel;
use App\Services\Excel\Base\ExcelCellSetter;
use App\Services\Excel\Base\ExcelWriterService;
use Illuminate\Support\Collection;

class CourtsExcelWriterService extends ExcelWriterService
{
    function handle(Collection $courts)
    {
        $setter = $this->cellSetter;
        $setter->setColumnWidth('A', 10.6);
        $setter->setColumnWidth('B', 7);
        $setter->setColumnWidth('E', 6);
        $setter->setColumnWidth('F', 6);
        $setter->setColumnWidth('G', 15);
        $setter->setColumnWidth('H', 12);
        $setter->setColumnWidth('I', 6);
        $setter->setColumnWidth('J', 7);
        $setter->setColumnWidth('k', 8);
        $setter->setRowAsHeader(12);
        $setter->setHeaderAndNext('Название суда');
        $setter->setHeaderAndNext('Адрес');
        $setter->setHeaderAndNext('Ид. типа');
        $setter->setHeaderAndNext('Ид. уровня');
        $setter->setHeaderAndNext('ИНН Реквизитов (необяз.)');
        $setter->setHeaderAndNext('КПП Реквизитов (необяз.)');
        $setter->setHeaderAndNext('Получатель (реквиз. Необяз.)');
        $setter->setHeaderAndNext('Наименование банка (необяз.)');
        $setter->setHeaderAndNext('БИК Банка (необяз.)');
        $setter->setHeaderAndNext('Номер счета банка (необяз.)');
        $setter->setHeaderAndNext('Номер счета получателя (необяз.)');
        $setter->setHeaderAndNext('Идентификатор');
        $setter->nextRow();
        $courts->each(function (Court $court) use($setter) {
            $setter->setCellAndNext($court->name);
            $setter->setCellAndNext($court->address->getFull());
            $setter->setCellAndNext($court->type_id);
            $setter->setCellAndNext($court->level_id);
            if($court->requisites) {
                $requisites = $court->requisites;
                $setter->setCellAndNext($requisites->inn);
                $setter->setCellAndNext($requisites->kpp);
                $setter->setCellAndNext($requisites->recipient);
                $setter->setCellAndNext($requisites->bank->name);
                $setter->setCellAndNext($requisites->bank->BIK);
                $setter->setCellAndNext($requisites->correspondent_account);
                $setter->setCellAndNext($requisites->checking_account);
            }
            else $setter->setColumn(12);
            $setter->setCellAndNext($court->id);
            $setter->nextRow();
        });
        $levelSheet = $this->spreadsheet->createSheet();
        $levelSheet->setTitle('Ид. уровней');
        $levelSetter = new ExcelCellSetter($levelSheet);
        $levelSetter->createIdNameHeaders();
        $levels = CourtLevel::all();
        $levels->each(function (CourtLevel $level) use ($levelSetter) {
            $levelSetter->setCellAndNext($level->id);
            $levelSetter->setCellAndNext($level->name);
            $levelSetter->nextRow();
        });
        $typeSheet = $this->spreadsheet->createSheet();
        $typeSheet->setTitle('Ид. типов');
        $typeSetter = new ExcelCellSetter($typeSheet);
        $typeSetter->createIdNameHeaders();
        $types = ContractType::all();
        $types->each(function (ContractType $type) use ($typeSetter) {
            $typeSetter->setCellAndNext($type->id);
            $typeSetter->setCellAndNext($type->name);
            $typeSetter->nextRow();
        });
        $this->spreadsheet->setActiveSheetIndex(0);
    }

}