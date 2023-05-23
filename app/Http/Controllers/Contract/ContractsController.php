<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Requests\PaginateRequest;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractStatus;
use App\Providers\Database\ContractsProvider;

class ContractsController
{
    function getLimitations(PaginateRequest $request, ContractsProvider $provider): array
    {
        $data = $request->validated();
        $paginator = $provider->getLimitations($data);
        $list = $paginator->items()->map(function (Contract $contract) {
            return [
                'debtor' => $contract->debtor->name->getFull(),
                'creditor' => $contract->creditor->shortOrName(),
                'limitation' => $contract->due_date->addYears(3),
                'date_issue' => $contract->issued_date,
                'id' => $contract->id
            ];
        });
        return $paginator->jsonResponse($list);
    }

    function getStatusList(): array
    {
        return ContractStatus::all()->toArray();
    }


}
