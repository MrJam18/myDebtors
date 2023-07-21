<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Controllers\Contract\ContractsController;
use App\Http\Requests\PaginateRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Contract\Contract;
use App\Models\Passport\Passport;
use App\Models\Passport\PassportType;
use App\Models\Subject\People\Debtor;
use App\Models\Subject\People\Name;
use App\Providers\Database\DebtorsProvider;
use App\Services\AddressService;
use App\Services\Excel\Readers\CreateDebtorsExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DebtorsController extends AbstractController
{

    function createOne(Request $request): array
    {
        $formData = $this->getFormData();
        $addressData = $request->input('address');
        $returned = null;
        DB::transaction(function () use (&$formData, &$addressData, &$returned) {
            $addressService = new AddressService();
            $debtor = new Debtor();
            $name = new Name([
                'surname' => $formData['surname'],
                'name' => $formData['name'],
            ]);
            if(isset($formData['patronymic'])) $name->patronymic = $formData['patronymic'];
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
            $returned = [
                'id' => $debtor->id,
                'name' => "{$debtor->name->getFull()}, {$debtor->birth_date->format(RUS_DATE_FORMAT)} г. р."
            ];
        });
        return $returned;
    }
    function getOne(Debtor $debtor): array
    {
        $data = array_merge($debtor->toArray(), $debtor->name->toArray());
        $data['address'] = $debtor->address->getFull();
        $data['birth_date'] = $debtor->birth_date->format(ISO_DATE_FORMAT);
        if($debtor->passport) {
            $data = array_merge($data, $debtor->passport->toArray());
        }
        unset($data['user']);
        $data['id'] = $debtor->id;
        return $data;
    }
    function getPassportTypes(): array | Collection
    {
        return PassportType::all();
    }
    function changeOne(Request $request, Debtor $debtor): void
    {
        $data = $request->all();
        DB::transaction(function () use ($data, $debtor) {
            $formData = $data['formData'];
            if(isset($data['address'])) {
                $addressService = new AddressService();
                $address = $addressService->addAddress($data['address']);
                $oldAddress = $debtor->address;
                $debtor->address()->associate($address);
            }
            $name = $debtor->name;
            if($name->surname !== $formData['surname'] || $name->name !== $formData['name'] || (!$name->patronymic === isset($formData['patronymic'])) || (isset($formData['patronymic']) && $name->patronymic !== $formData['patronymic'])) {
                $name->surname = $formData['surname'];
                $name->name = $formData['name'];
                if(isset($formData['patronymic'])) $name->patronymic = $formData['patronymic'];
                else $name->patronymic = null;
                $name->save();
            }
            $debtor->birth_place = $formData['birthPlace'];
            $debtor->birth_date = $formData['birthDate'];
            $passport = $debtor->passport;
            $passport->series = $formData['series'];
            $passport->number = $formData['number'];
            if(isset($formData['issue'])) {
                $passport->issued_by = $formData['issue'];
                $passport->issued_date = $formData['issueDate'];
                $passport->gov_unit_code = $formData['govCode'];
            }
            $type = PassportType::find($formData['typeId']);
            $passport->type()->associate($type);
            $passport->save();
            $debtor->user()->associate(Auth::user());
            $debtor->save();
            if(isset($oldAddress)) $oldAddress->delete();
        });
    }
    function createFromExcel(Request $request)
    {
        $file = $request->file('table');
        $service = CreateDebtorsExcelService::createFromPath($file->getRealPath());
        $service->handle();
    }
    function getSearchList(SearchRequest $request): Collection
    {
        $list = Debtor::query()->searchByFullName($request->validated())
            ->byGroupId(getGroupId())
            ->limit(5)
            ->select(['names.*', 'debtors.id', 'debtors.birth_date'])->get();
        return $list->map(function (Debtor $debtor) {
            $name = getFullName($debtor);
            return [
                'id' => $debtor->id,
                'name' => "$name, {$debtor->birth_date->format(RUS_DATE_FORMAT)} г. р."
            ];
        });
    }
    function getList(PaginateRequest $request, DebtorsProvider $provider): array
    {
        $paginator = $provider->getList($request->validated());
        $list = $paginator->items()->map(function (Debtor $debtor) {
            $name = getFullName($debtor);
            return [
                'debtors.created_at' => $debtor->created_at->format(RUS_DATE_FORMAT) . ' г.',
                'names.surname' => $name,
                'debtors.birth_date' => $debtor->birth_date->format(RUS_DATE_FORMAT) . ' г.',
                'settlements.name' => $debtor->address->getShortByNested(),
                'id' => $debtor->id
            ];
        });
        return $paginator->jsonResponse($list);
    }

    function deleteOne(Debtor $debtor): void
    {
        DB::transaction(function () use ($debtor) {
            $contractsController = new ContractsController();
            $debtor->contracts->each(function (Contract $contract) use ($contractsController) {
                $contractsController->deleteOne($contract);
            });
            $debtor->delete();
            $debtor->name->delete();
            $debtor->address->delete();
            $debtor->passport->delete();
            $debtor->name->delete();
        });
    }
}
