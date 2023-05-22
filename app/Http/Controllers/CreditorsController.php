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
    function addOne(Request $request): void
    {
        $data = $request->all();
        DB::transaction(function () use(&$data) {
            $user = Auth::user();
            $addressService = new AddressService();
            $formData = $data['formData'];
            $creditorType = CreditorType::find((int)$formData['creditorTypeId']);
            $address = $addressService->addAddress($data['address']);
            $bankRequisites = BankRequisites::find($data['bankRequisitesId']);
            $requisites = new Requisites();
            $requisites->checking_account = $formData['checkingAccount'];
            $requisites->correspondent_account = $formData['correspondentAccount'];
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
        });
    }
    function getOne(Request $request, $id): array
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

}
