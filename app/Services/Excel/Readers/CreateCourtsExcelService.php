<?php
declare(strict_types=1);

namespace App\Services\Excel\Readers;

use App\Models\Requisites\BankRequisites;
use App\Models\Requisites\Requisites;
use App\Models\Subject\Court\Court;
use App\Services\AddressService;
use App\Services\Excel\Base\ExcelCellGetter;
use App\Services\Excel\Base\ExcelReaderService;

class CreateCourtsExcelService extends ExcelReaderService
{

    protected function handler(ExcelCellGetter $getter): void
    {
        $addressService = new AddressService();
        $this->handleEachRow(function (ExcelCellGetter $getter) use ($addressService) {
            $court = new Court();
            $court->name = $getter->getValueAndNext();
            $court->address()->associate($addressService->getAddressFromString($getter->getValueAndNext()));
            $court->type_id = $getter->getValueAndNext();
            $court->level_id = $getter->getValueAndNext();
            if($getter->checkValueExists()) {
                $requisites = new Requisites();
                $requisites->inn = $getter->getValueAndNext();
                $requisites->kpp = $getter->getValueAndNext();
                $requisites->recipient = $getter->getValueAndNext();
                $bankName = $getter->getValueAndNext();
                $bik = $getter->getValueAndNext();
                $bank = BankRequisites::firstOrCreate(['bik' => $bik], [
                    'name' => $bankName,
                    'BIK' => $bik
                ]);
                $requisites->bank()->associate($bank);
                $requisites->correspondent_account = $getter->getValueAndNext();
                $requisites->checking_account = $getter->getValueAndNext();
            }
            $court->save();
            $getter->nextRow();
        });
    }
}