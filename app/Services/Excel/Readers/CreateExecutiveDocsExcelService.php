<?php
declare(strict_types=1);

namespace App\Services\Excel\Readers;

use App\Enums\Database\ExecutiveDocTypeEnum;
use App\Models\Contract\Contract;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\MoneySum;
use App\Services\Excel\Base\ExcelCellGetter;
use App\Services\Excel\Base\ExcelReaderService;

class CreateExecutiveDocsExcelService extends ExcelReaderService
{

    protected function handler(ExcelCellGetter $getter): void
    {
        $this->handleEachRow(function (ExcelCellGetter $getter) {
            $executiveDoc = new ExecutiveDocument();
            if(!$getter->checkValueExists()) return false;
            $executiveDoc->issued_date = $getter->getDateAndNext();
            $executiveDoc->number = $getter->getValueAndNext();
            $executiveDoc->type_id = $getter->getValueAndNext();
            if($executiveDoc->type_id === ExecutiveDocTypeEnum::ReceivingOrder) {
                $executiveDoc->resolution_date = $getter->getDateAndNext();
                $executiveDoc->resolution_number = $getter->getValueAndNext();
            }
            else $getter->setColumn(6);
            $sums = new MoneySum();
            $sums->main = $getter->getValueAndNext();
            $sums->percents = $getter->getValueAndNext();
            $sums->penalties = $getter->getValueAndNext();
            $sums->countSum();
            $sums->save();
            $executiveDoc->moneySum()->associate($sums);
            $executiveDoc->fee = $getter->getValueAndNext();
            $contract = Contract::findWithGroupId($getter->getValueAndNext());
            $executiveDoc->contract()->associate($contract);
            $executiveDoc->court_id = $getter->getValueAndNext();
            $executiveDoc->bailiff_department_id = $getter->getValueAndNext();
            $executiveDoc->save();
            $getter->nextRow();
        });
    }
}