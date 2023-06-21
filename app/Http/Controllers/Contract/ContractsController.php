<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Enums\Database\ActionObjectEnum;
use App\Enums\Database\ActionTypeEnum;
use App\Enums\Database\ContractTypeEnum;
use App\Exceptions\ShowableException;
use App\Http\Requests\PaginateRequest;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractStatus;
use App\Models\Contract\ContractType;
use App\Models\CourtClaim\CourtClaim;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Debtor;
use App\Providers\Database\Contracts\ContractsProvider;
use App\Services\ActionsService;
use App\Services\Counters\CreditCountService;
use App\Services\Counters\LimitedLoanCountService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
                'limitation' => $contract->due_date->addYears(3)->format(RUS_DATE_FORMAT),
                'date_issue' => $contract->issued_date->format(RUS_DATE_FORMAT),
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
        if($type->id === ContractTypeEnum::Credit->value) {
            $contract->month_due_sum = (float)$formData['month_due_sum'];
            $contract->month_due_date = (int)$formData['month_due_date'];
        }
        $contract->number = $formData['number'];
        $contract->issued_date = $formData['issued_date'];
        $contract->issued_sum = $formData['issued_sum'];
        $contract->due_date = $formData['due_date'];
        $contract->percent = $formData['percent'];
        $contract->penalty = $formData['penalty'];
        $contract->status_changed_at = Carbon::now();
        $contract->user()->associate(Auth::user());
        $contract->save();
        $actionService = new ActionsService($contract->id, ActionObjectEnum::Contract);
        $actionService->createAction(ActionTypeEnum::Create, 'создан настоящий контракт');
        Storage::createDirectory('contracts/' . $contract->id);
    }
    /**
     * @throws Exception
     */
    public function getOne($id): array
    {
        $contractId = (int)$id;
        /**
         * @var Contract $contract
         */
        $contract = Contract::findWithGroupId($contractId);
        if (!$contract) throw new Exception('cant find contract by id');
        $now  = Carbon::now();
        $countService = new LimitedLoanCountService();
        $result = $countService->count($contract, $now);
        $delayDays = $now->diffInDays($contract->due_date);
        if($contract->executiveDocument) {
            $executiveDocName = $contract->executiveDocument->type->name . ' №' . $contract->executiveDocument->number . ' от ' . $contract->executiveDocument->issued_date->format(RUS_DATE_FORMAT) . ' г.';
        }
        else $executiveDocName = 'Отсутствует';
        if($contract->cession) {
            /**
             * @var Creditor $firstCreditor;
             */
            $firstCreditor = $contract->cession->cessions()->orderBy('transfer_date')->first()->assignee;

        }
        else $firstCreditor = $contract->creditor;
        /**
         * @var CourtClaim $lastClaim;
         */
        $lastClaim = $contract->courtClaims()->orderBy('created_at', 'desc')->first();
        if($lastClaim) {
            $lastClaimName = "{$lastClaim->type->name} от {$lastClaim->created_at->format(RUS_DATE_FORMAT)} г.";
        }
        else $lastClaimName = 'Отсутствует';
        return [
            'contract' => [
                'name'=>$contract->type->name,
                'date_issue' => $contract->issued_date->format(RUS_DATE_FORMAT),
                'debtorId'=> $contract->debtor->id,
                'debtorName' => $contract->debtor->name->getFull(),
                'status' => $contract->status,
                'creditor' => $contract->creditor->name,
                'creditorId' => $contract->creditor->id,
                'firstCreditor' => $firstCreditor->name,
                'cession' => $contract->cession?->name ?? 'Принадлежит выдавшей организации' ,
                'cessionId' => $contract->cession?->id,
                'number' => $contract->number,
                'sum_issue' => $contract->issued_sum,
                'due_date' => $contract->due_date->format(RUS_DATE_FORMAT),
                'delayDays' => $delayDays,
                'mainToday' => $result->main,
                'percent' => $contract->percent,
                'percentToday'=> $result->percents,
                'penalty' => $contract->penalty,
                'penaltyToday' => $result->penalties,
                'paymentsCount' => $contract->payments->count(),
                'createdAt' => $contract->created_at->format(RUS_DATE_FORMAT),
                'executiveDocName' => $executiveDocName,
                'executiveDocId' => $contract->executiveDocument?->id,
                'id' => $contract->id,
                'month_due_date' => $contract->month_due_date,
                'month_due_sum' => $contract->month_due_sum,
                'typeId' => $contract->type->id,
                'courtClaimName' => $lastClaimName,
                'courtClaimId' => $lastClaim->id
            ]
        ];
    }

    public function changeContract(Request $request): void
    {
        /**
         * @var Contract $contract
         */
        $data = $request->all();
        $contract= Contract::findWithGroupId((int)$data['contractId']);

        switch ($data['column']) {
            case 'statusId':
                $object = ActionObjectEnum::Status;
                $result = 'Статус изменен с "' . $contract->status->name . '" на "';
                $contract->status()->associate($data['value']);
                $result .= $contract->status->name . '"';
                break;
            case 'penalty':
                $object = ActionObjectEnum::Penalty;
                $result = 'Процент неустойки изменен с ' . $contract->penalty . ' % на ';
                $contract->penalty = $data['value'];
                $result .= $contract->penalty . '% годовых';
                break;
            case 'percent':
                $object = ActionObjectEnum::Percent;
                $result = 'Процентная ставка изменена с ' . $contract->percent . ' % на ' . $data['value'] . '% годовых';
                $contract->percent = $data['value'];
                break;
            case 'sum_issue':
                $object = ActionObjectEnum::IssuedSum;
                $result = 'Сумма выдачи изменена с ' . $contract->issued_sum . " руб. на " . $data['value'] . "руб.";
                $contract->issued_sum = $data['value'];
                break;
            case 'number':
                $object = ActionObjectEnum::Number;
                $result = 'Номер договора изменен с "' . $contract->number . '" на "' . $data['value'] . '"';
                $contract->number = $data['value'];
                break;
            case 'date_issue':
                $object = ActionObjectEnum::IssuedDate;
                $result = 'Дата договора изменена с "' . $contract->issued_date->format(RUS_DATE_FORMAT) . '" на "';
                $contract->issued_date = $data['value'];
                $result .= $contract->issued_date->format(RUS_DATE_FORMAT) . '"';
                break;
            case 'due_date':
                $object = ActionObjectEnum::DueDate;
                $result = 'Дата исполнения изменена с "' . $contract->due_date->format(RUS_DATE_FORMAT) . '" на "';
                $contract->due_date = $data['value'];
                $result .= $contract->due_date->format(RUS_DATE_FORMAT) . '"';
                break;
            case 'month_due_date':
                if((int)$data['value'] > 31) throw new ShowableException('Дата ежемесячного платежа не может быть больше 31');
                $object = ActionObjectEnum::MonthDueDate;
                $result = "Дата ежемесячного платежа изменена с {$contract->month_due_date} на {$data['value']}";
                $contract->month_due_date = (int)$data['value'];
                break;
            case 'month_due_sum':
                $object = ActionObjectEnum::MonthDueSum;
                $result = "Сумма ежемесячного платежа изменена с {$contract->month_due_sum} на {$data['value']} руб.";
                $contract->month_due_sum = (float)$data['value'];
                break;
        }
        $contract->save();
        if(isset($object)) {
            $actionsService = new ActionsService($contract->id, $object);
            $actionsService->createAction(ActionTypeEnum::Change, $result);
        }
        $needCount = [
            'percent',
            'penalty',
            'date_issue',
            'due_date',
            'sum_issue',
            'month_due_date',
            'month_due_sum'
        ];
        if(in_array($data['column'], $needCount)) {
            if($contract->type->id === 1) $countService = new LimitedLoanCountService();
            else $countService = new CreditCountService();
            $countService->count($contract, now());
            $countService->savePayments();
        }
    }
    function changeCreditor(Contract $contract, Request $request): void
    {
        $creditor = Creditor::findWithGroupId($request->input('creditorId'));
        $cession = CessionGroup::findWithGroupId($request->input('cessionId'));
        $contract->creditor()->associate($creditor);
        $contract->cession()->associate($cession);
        $contract->save();
    }
}
