<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Contract\Contract;
use App\Models\Passport\Passport;
use App\Models\Passport\PassportType;
use App\Models\Subject\People\Debtor;
use App\Models\Subject\People\Name;
use App\Services\AddressService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
            ]);
            if(isset($formData['issue'])) {
                $passport->issued_by = $formData['issue'];
                $passport->issued_date = $formData['issueDate'];
                $passport->gov_unit_code = $formData['govCode'];
            }
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
    function getOne(Debtor $debtor): array
    {
        $nameColums = $debtor->name;
        $passport = $debtor->passport;
        $data = [
            'name.surname' => $nameColums->surname,
            'name.name' => $nameColums->name,
            'name.patronymic' => $nameColums->patronymic,
            'birth_date' => $debtor->birth_date->format(RUS_DATE_FORMAT),
            'birth_place' => $debtor->birth_place,
            'countContracts' => Contract::query()->where('debtor_id', '=', $debtor->id)->count(),
            'fullAddress' => $debtor->address->getFull(),
            'created_at' => $debtor->created_at->format(RUS_DATE_FORMAT),
            'updated_at' => $debtor->updated_at->format(RUS_DATE_FORMAT),
            'initials' => $debtor->name->initials()
        ];
        if($passport) $data['passport'] = [
          'type' => [
              'value' => $passport->type->name,
              'id' => $passport->type->id
          ],
          'seriesAndNumber' => [
              'series' => $passport->series,
              'number' => $passport->number
          ],
            ];
        if($passport->issued_date) {
           $otherFields = [
               'issued_date' => $passport->issued_date->format(RUS_DATE_FORMAT),
               'issued_by' => $passport->issued_by,
               'gov_unit_code' => $passport->gov_unit_code,
               'updated_at' => $passport->updated_at->format(RUS_DATE_FORMAT)
           ];
            $data['passport'] = array_merge($data['passport'], $otherFields);
        }
        return $data;
    }
    function getPassportTypes(): array | Collection
    {
        return PassportType::all();
    }
    function changeOne(Request $request, Debtor $debtor): void
    {
        if(!$debtor->exists() || $debtor->user->group->id !== getGroupId()) throw new Exception('cant find debtor');
        $data = $request->all();
        $column = array_key_first($data);
        $value = $data[$column];
        if($column === 'address') {
            $addressService = new AddressService();
            $address = $addressService->addAddress($value);
            $oldAddress = $debtor->address;
            $debtor->address()->associate($address);
            $debtor->save();
            $oldAddress->delete();
            return;
        }
        $debtor->updateInnerModel($column, $value);
    }
}
