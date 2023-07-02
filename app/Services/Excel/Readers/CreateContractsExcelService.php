<?php
declare(strict_types=1);

namespace App\Services\Excel\Readers;

use App\Enums\Database\ContractTypeEnum;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Debtor;
use App\Services\Excel\Base\ExcelCellGetter;
use App\Services\Excel\Base\ExcelReaderService;
use Illuminate\Support\Facades\Auth;

class CreateContractsExcelService extends ExcelReaderService
{
    function handler(ExcelCellGetter $getter): void
    {
        $this->handleEachRow(function (ExcelCellGetter $getter) {
            $contract = new Contract();
            $contract->type_id = $getter->getValueAndNext();
            $contract->status_id = $getter->getValueAndNext();
            $contract->number = $getter->getValueAndNext();
            $contract->issued_date = $getter->getDateAndNext();
            $contract->issued_sum = $getter->getValueAndNext();
            $contract->due_date = $getter->getDateAndNext();
            $contract->percent = $getter->getValueAndNext();
            $contract->penalty = $getter->getValueAndNext();
            $creditor = Creditor::findWithGroupId($getter->getValueAndNext());
            $contract->creditor()->associate($creditor);
            $debtor = Debtor::findWithGroupId($getter->getValueAndNext());
            $contract->debtor()->associate($debtor);
            $cession = CessionGroup::findWithGroupId($getter->getValueAndNext());
            $contract->cession()->associate($cession);
            if($contract->type_id == ContractTypeEnum::Credit->value) {
                $contract->month_due_sum = $getter->getValueAndNext();
                $contract->month_due_date = $getter->getValueAndNext();
            }
            $contract->status_changed_at = now();
            $contract->user_id = Auth::id();
            $contract->save();
            $getter->nextRow();
        });
    }

}