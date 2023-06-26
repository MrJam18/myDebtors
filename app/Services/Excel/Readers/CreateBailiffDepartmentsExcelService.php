<?php
declare(strict_types=1);

namespace App\Services\Excel\Readers;

use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Services\AddressService;
use App\Services\Excel\Base\ExcelCellGetter;
use App\Services\Excel\Base\ExcelReaderService;

class CreateBailiffDepartmentsExcelService extends ExcelReaderService
{

    protected function handler(ExcelCellGetter $getter): void
    {
        $addressService = new AddressService();
        $this->handleEachRow(function (ExcelCellGetter $getter) use ($addressService) {
            $department = new BailiffDepartment();
            $department->name = $getter->getValueAndNext();
            $address = $addressService->getAddressFromString($getter->getValueAndNext());
            $department->address()->associate($address);
            $department->save();
            $getter->nextRow();
        });
    }
}