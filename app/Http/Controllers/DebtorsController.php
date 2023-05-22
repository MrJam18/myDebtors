<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Passport\Passport;
use App\Models\Passport\PassportType;
use App\Models\Subject\Debtor;
use App\Models\Subject\Name;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DebtorsController extends AbstractController
{

    function createOne(Request $request): void
    {
        $formData = $this->getFormData();
        $addressData = $request->input('address');
        DB::transaction(function () use (&$formData, &$addressData) {
            $addressService = new AddressService();
            $debtor = new Debtor();
            $name = new Name([
                'surname' => $formData['surname'],
                'name' => $formData['name'],
                'patronymic' => $formData['patronymic']
            ]);
            $name->save();

            $debtor->name()->associate($name);
            $debtor->birth_place = $formData['birthPlace'];
            $debtor->birth_date = $formData['birthDate'];
            $passport = new Passport([
                'series' => $formData['series'],
                'number' => $formData['number'],
                'issued_by' => $formData['issue'],
                'issued_date' => $formData['issueDate'],
                'gov_unit_code' => $formData['govCode'],
            ]);
            $type = PassportType::find($formData['typeId']);
            $passport->type()->associate($type);
            $passport->save();
            $debtor->passport()->associate($passport);
            $address = $addressService->addAddress($addressData);
            $debtor->address()->associate($address);
            $debtor->user()->associate(Auth::user());
            $debtor->save();
        });
    }
}
