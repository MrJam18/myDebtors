<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\PaginateRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Requisites\BankRequisites;
use App\Models\Requisites\Requisites;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Creditor\CreditorType;
use App\Providers\Database\CreditorsProvider;
use App\Services\AddressService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreditorsController
{

    function getList(PaginateRequest $request, CreditorsProvider $provider): array | JsonResponse
    {
        $data = $request->validated();
        $paginator = $provider->getList(getGroupId(), $data);

        $list = $paginator->items()->map(function (Creditor $creditor) {
            return [
                'creditors.id' => $creditor->id,
                'idd' => $creditor->id,
                'created_at' => $creditor->created_at,
                'short' => $creditor->short,
                'name' => $creditor->name,
                'court_identifier' => $creditor->court_identifier,
                'type' => $creditor->type->name,
            ];
        });
        return $paginator->jsonResponse($list);
    }

    function getTypeList(): array | Collection
    {
        return CreditorType::query()->get();
    }

    function searchBankRequisites(SearchRequest $request): array | Collection
    {
        $data = BankRequisites::query()->search([
            'name' => $request->validated(),
            'BIK' => $request->validated()
        ])->get();
        return $data->map(function(BankRequisites $requisites){
            return [
                'id' => $requisites->id,
                'name' => $requisites->name . ' ' . $requisites->BIK
            ];
        });
    }

    function addBankRequisites(Request $request): array | JsonResponse
    {
        try {
            $bankRequisites = new BankRequisites();
            $bankRequisites->name = $request->input('name');
            $bankRequisites->BIK = $request->input('BIK');
            $bankRequisites->save();
            return [
                'id' => $bankRequisites->id,
                'name' => $bankRequisites->name . ' ' . $bankRequisites->BIK
            ];
        } catch (QueryException $exception) {
            if($exception->getCode() == 23000) {
                return response()->json([
                    'message' => 'Реквизиты с таким же БИК уже существуют. Воспользуйтесь поиском.'
                ])->setStatusCode(551);
            }
            throw $exception;
        }
    }
    function addOne(Request $request): array
    {
        $data = $request->all();
        $returned = null;
        DB::transaction(function () use(&$data, &$returned) {
            $user = Auth::user();
            $addressService = new AddressService();
            $formData = $data['formData'];
            $creditorType = CreditorType::find((int)$formData['creditorTypeId']);
            $address = $addressService->addAddress($data['address']);
            $bankRequisites = BankRequisites::find($data['bankRequisitesId']);
            $requisites = new Requisites();
            $requisites->checking_account = $formData['checking_account'];
            $requisites->correspondent_account = $formData['correspondent_account'];
            $requisites->bank()->associate($bankRequisites);
            $requisites->user()->associate($user);
            $requisites->save();
            $creditor = new Creditor();
            $creditor->type()->associate($creditorType);
            $creditor->address()->associate($address);
            $creditor->requisites()->associate($requisites);
            $creditor->name = $formData['name'];
            $creditor->short = $formData['short'];
            $creditor->court_identifier = $formData['courtIdentifier'];
            $creditor->user()->associate(Auth::user());
            $creditor->save();
            $returned = $this->getIdName($creditor);
        });
        return $returned;
    }
    function getOne(Request $request): array
    {
        /**
         * @var $creditor Creditor
         */
        $creditor = Creditor::query()->byGroupId(Auth::user()->group->id)->find($request->input('id'));
        if(!$creditor) throw new Exception('cant find creditor by id ' . $request->input('id'));
        return [
            'type_id' => $creditor->type->id,
            'name' => $creditor->name,
            'short' => $creditor->short,
            'court_identifier' => $creditor->court_identifier,
            'fullAddress' => $creditor->address->getFull(),
            'requisites' => [
                'checking_account' => $creditor->requisites->checking_account,
                'correspondent_account' => $creditor->requisites->correspondent_account,
                'bankRequisites' => $creditor->requisites->bank
            ]
        ];
    }
    function changeOne(Request $request): void
    {
        $data = $request->all();
        DB::transaction(function () use (&$data) {
            $formData = $data['formData'];
            $creditor = Creditor::find($data['id']);
            $requisites = $creditor->requisites;
            $requisites->checking_account = $formData['checking_account'];
            $requisites->correspondent_account = $formData['correspondent_account'];
            if($requisites->bank->id !== $data['bankRequisitesId']) {
                $bank = BankRequisites::find($data['bankRequisitesId']);
                if($bank) $requisites->bank()->associate($bank);
            }
            $requisites->save();
            $oldAddress = null;
            if($data['address'] !== 'initial') {
                $addressService = new AddressService();
                $address = $addressService->addAddress($data['address']);
                $oldAddress = $creditor->address;
                $creditor->address()->associate($address);
            }
            if((int)$formData['creditorTypeId'] !== $creditor->type->id) {
                $type = CreditorType::find((int)$formData['creditorTypeId']);
                $creditor->type()->associate($type);
            }
            $creditor->name = $formData['name'];
            $creditor->short = $formData['short'];
            $creditor->court_identifier = $formData['courtIdentifier'];
            $creditor->save();
            $oldAddress?->delete();
        });
    }
    function deleteOne(Request $request): void
    {
        /**
         * @var $creditor Creditor
         */
        $creditor = Creditor::query()->byGroupId(getGroupId())->find($request->input('id'));
        if ($creditor) {
            $creditor->delete();
            $creditor->requisites->delete();
            $creditor->address->delete();
        }
        else throw new Exception('cant find creditor');
    }

    function getSearchListWithCession(SearchRequest $request): array | Collection
    {
        $data = Creditor::query()->byGroupId(getGroupId())->search([
            'name' => $request->validated(),
            'short' => $request->validated()
        ])->with(['defaultCession:id,name', 'type'])->limit(5)->get();
        return $data->map(function (Creditor $creditor) {
            $data = $this->getIdName($creditor);
            if($creditor->defaultCession) {
                $data['default_cession'] = [
                    'id' => $creditor->defaultCession->id,
                    'name' => $creditor->defaultCession->name
                ];
            }
            return $data;
        });
    }
    function getSearchList(SearchRequest $request): array | Collection
    {
        $data = Creditor::query()->byGroupId(getGroupId())->search([
            'name' => $request->validated(),
            'short' => $request->validated()
        ])->limit(5)->get();
        return $data->map(function (Creditor $creditor) {
            $data = $this->getIdName($creditor);
            $data['short'] = $creditor->short;
            return $data;
        });
    }
    private function getIdName(Creditor $creditor): array
    {
        if ($creditor->type->id !== 3 && $creditor->short) $name = $creditor->short . ", ИНН: " . $creditor->court_identifier;
        else $name = $creditor->name;
        return [
            'id' => $creditor->id,
            'name' => $name
        ];
    }
}
