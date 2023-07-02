<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Auth\User;
use App\Models\Contract\Contract;
use App\Models\Subject\People\Debtor;
use App\Providers\Database\ContractsProvider;
use App\Providers\Database\DebtorsProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ListController extends AbstractController
{
    function getList(PaginateRequest $request, DebtorsProvider $provider): array
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        $requestData = $request->validated();
        $paginator = $provider->getList($user->group->id, $requestData);
        if($requestData->orderBy->column === 'contracts.issued_date') {
            $list = $paginator->items()->map(function (Debtor $debtor) {
                $issued_date = (new Carbon($debtor->contract_issued_date))->format(RUS_DATE_FORMAT);
                $contracts = [
                    [
                        'text' => "договор № $debtor->contract_number, выдан $issued_date г.",
                        'id' => $debtor->contract_id,
                        'creditor' => $debtor->creditor_name,
                        'status' => $debtor->contract_status_name
                    ]
                ];
                return [
                    'id' => $debtor->id,
                    'text' => $debtor->name->getFull() . ", " . $debtor->birth_date->format(RUS_DATE_FORMAT) . ' г. р., место рождения: ' . $debtor->birth_place,
                    'contracts' => $contracts
                ];
            });
        }
        else {
            $list = $paginator->items()->map(function (Debtor $debtor) {
                $contracts = $debtor->contracts->map(function (Contract $contract) {
                    return [
                        'text' => 'договор № ' . $contract->number . ', выдан ' . $contract->issued_date->format(RUS_DATE_FORMAT) . ' г.',
                        'id' => $contract->id,
                        'creditor' => $contract->creditor->name,
                        'status' => $contract->status->name
                    ];
                });
                return [
                    'id' => $debtor->id,
                    'text' => $debtor->name->getFull() . ", " . $debtor->birth_date->format(RUS_DATE_FORMAT) . ' г. р., место рождения: ' . $debtor->birth_place,
                    'contracts' => $contracts
                ];
            });
        }
        return $paginator->jsonResponse($list);
    }

    function getContractList(PaginateRequest $request, ContractsProvider $provider): array {
        $paginator = $provider->getList($request->validated());
        $list = $paginator->items()->map(function (Contract $contract) {
            $debtorName = "$contract->surname $contract->name";
            if($contract->patronymic) $debtorName .= ' ' . $contract->patronymic;
            $creditorName = $contract->short;
            if(!$creditorName) $creditorName = $contract->creditor_name;
            return [
                'number' => $contract->number,
                'issued_date' => $contract->issued_date->format(RUS_DATE_FORMAT) . ' г.',
                'id' => $contract->id,
                'debtor' => $debtorName,
                'creditor' => $creditorName,
                'status' => $contract->status_name
            ];
        });
        return $paginator->jsonResponse($list);
    }
}
