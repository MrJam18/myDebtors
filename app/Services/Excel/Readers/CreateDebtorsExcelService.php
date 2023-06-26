<?php
declare(strict_types=1);

namespace App\Services\Excel\Readers;

use App\Models\Passport\Passport;
use App\Models\Subject\People\Debtor;
use App\Models\Subject\People\Name;
use App\Services\AddressService;
use App\Services\Excel\Base\ExcelCellGetter;
use App\Services\Excel\Base\ExcelReaderService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CreateDebtorsExcelService extends ExcelReaderService
{

    function handler(ExcelCellGetter $getter): void
    {
        $lastRow = $this->activeSheet->getHighestRow();
        $addressService = new AddressService();
        for($row = 2; $row <= $lastRow; $row++) {
            $debtor = new Debtor();
            $name = new Name();
            $name->surname = $getter->getValueAndNext();
            $name->name = $getter->getValueAndNext();
            $name->patronymic = $getter->getValueAndNext();
            $name->save();
            $debtor->name()->associate($name);
            $debtor->birth_date = $getter->getDateAndNext();
            $debtor->birth_place = $getter->getValueAndNext();
            $address = $addressService->getAddressFromString($getter->getValueAndNext());
            $debtor->address()->associate($address);
            $passport = new Passport();
            $passport->series = $getter->getValueAndNext();
            $passport->number = $getter->getValueAndNext();
            $passport->type_id = 1;
            $passport->save();
            $debtor->user()->associate(Auth::user());
            $debtor->passport()->associate($passport);
            $debtor->save();
            $getter->nextRow();
        }
    }

}