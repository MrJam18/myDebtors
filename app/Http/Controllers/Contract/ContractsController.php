<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Requests\PaginateRequest;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractStatus;
use App\Models\Contract\ContractType;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Debtor;
use App\Providers\Database\ContractsProvider;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

    function createOne(Request $request): void
    {
        $data = $request->all();
        $groupId = getGroupId();
        $formData = $data['formData'];
        $contract = new Contract();
        $creditor = Creditor::query()->byGroupId($groupId)->find($data['creditorId'], ['id']);
        if(!$creditor) throw new Exception('cant find creditor');
        $contract->creditor()->associate($creditor);
        if($data['cessionId']) {
            $cession = CessionGroup::query()->byGroupId($groupId)->find($data['cessionId'], ['id']);
            if(!$cession) throw new Exception('cant find cession');
            $contract->cession()->associate($cession);
        }
        $status = ContractStatus::find($data['statusId'], ['id']);
        if(!$status) throw new Exception('cant find status');
        $contract->status()->associate($status);
        $debtor = Debtor::query()->byGroupId($groupId)->find($data['debtorId'], ['id']);
        if(!$debtor) throw new Exception('cant find debtor');
        $contract->debtor()->associate($debtor);
        $type = ContractType::find($formData['typeId']);
        if(!$type) throw new Exception('cant find type');
        $contract->type()->associate($type);
        $contract->number = $formData['number'];
        $contract->issued_date = $formData['issued_date'];
        $contract->issued_sum = $formData['issued_sum'];
        $contract->due_date = $formData['due_date'];
        $contract->percent = $formData['percent'];
        $contract->penalty = $formData['penalty'];
        $contract->status_changed_at = Carbon::now();
        $contract->user()->associate(Auth::user());
        $contract->save();

    }

    public function getOne($id){
        $contract = Contract::query()->findOrFail($id);
        Log::info('find by id');
        if (!$contract) throw new Exception('cant find contract by id');
        Log::info((string)$contract);
    }

}
