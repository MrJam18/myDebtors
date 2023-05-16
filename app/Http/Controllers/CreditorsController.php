<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\PaginateRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Requisites\BankRequisites;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Creditor\CreditorType;
use App\Providers\Database\CreditorsProvider;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CreditorsController
{

    function getList(PaginateRequest $request, CreditorsProvider $provider): array
    {
        $data = $request->validated();
        $paginator = $provider->getList(getGroupId(), $data);
        $list = $paginator->items()->map(function (Creditor $creditor) {
       return [
           'created_at' => $creditor->created_at,
           'short' => $creditor->short,
           'name' => $creditor->name,
           'courtIdentifier' => $creditor->court_identifier,
           'type' => $creditor->type->name
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
}