<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Auth\User;
use App\Models\Contract\Contract;
use App\Models\Subject\Debtor;
use App\Providers\Database\DebtorsProvider;
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
        $list = $paginator->items()->map(function (Debtor $debtor){
            $contracts = $debtor->contracts->map(function (Contract $contract) {
                return [
                    'text' => 'договор № ' . $contract->number . ' выдан ' . $contract->issued_date->format(RUS_DATE_FORMAT) . ' г.',
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
        return $paginator->jsonResponse($list);
    }
}