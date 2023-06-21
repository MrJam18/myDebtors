<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Enums\Database\ActionObjectEnum;
use App\Enums\Database\ActionTypeEnum;
use App\Enums\Database\CourtClaimTypeEnum;
use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractContractController;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\CourtClaim\CourtClaimStatus;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\MoneySum;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class CourtClaimsController extends AbstractContractController
{
    public function __construct(Request $request)
    {
        parent::__construct($request, ActionObjectEnum::CourtClaim);
    }

    function getTypes(): Collection
    {
        return CourtClaimType::all();
    }

    function getStatuses(): Collection
    {
        return CourtClaimStatus::all();
    }

    function getOne(Contract $contract, CourtClaim $claim): array
    {
        if($claim->contract_id !== $contract->id) throw new ShowableException('Связь между судом и договором не совпадает');
        $returned = $claim->toArray();
        $returned['count_date'] = $claim->count_date->format(ISO_DATE_FORMAT);
        $returned['status_date'] = $returned['status_date'] . ' г.';
        $returned['typeId'] = $claim->type_id;
        $returned['statusId'] = $claim->status_id;
        $returned['court'] = [
            'id' => $claim->court->id,
            'name' => $claim->court->name
        ];
        $returned['agent'] = [
            'id' => $claim->agent->id,
            'name' => $claim->agent->name->getFull()
        ];
        return array_merge($returned, $claim->moneySum->toArray());
    }
    function changeOrCreateOne(Request $request, Contract $contract): void
    {
        $data = $request->all();
        $formData = $data['formData'];
        if(isset($data['courtClaimId'])) {
            $claim = CourtClaim::findWithGroupId($data['courtClaimId']);
            $actionText = "Изменен";
            $actionType = ActionTypeEnum::Change;
        }
        else {
            $claim = new CourtClaim();
            $claim->moneySum = new MoneySum();
            $actionText = 'Создан';
            $actionType = ActionTypeEnum::Create;
        }
        if($claim->type->id === CourtClaimTypeEnum::CourtClaim->value) $actionText .= 'о';
        $claim->type_id = (int)$formData['type_id'];
        $claim->count_date = $formData['count_date'];
        if($claim->status_id !== (int)$formData['status_id']) {
            $claim->status_date = now();
            $claim->status_id = (int)$formData['status_id'];
        }
        $claim->court_id = $data['court_id'];
        $claim->agent_id = $data['agent_id'];
        $sums = $claim->moneySum;
        $sums->main = $formData['main'];
        $sums->percents = $formData['percents'];
        $sums->penalties = $formData['penalties'];
        $sums->countSum();
        $sums->save();
        unset($claim->moneySum);
        $claim->moneySum()->associate($sums);
        $claim->contract()->associate($contract);
        $claim->is_contract_jurisdiction = $formData['is_contract_jurisdiction'];
        $claim->is_ignored_payments = $formData['is_ignored_payments'];
        $claim->user_id = Auth::id();
        $claim->fee = $formData['fee'];
        $claim->save();
        $actionText .= " {$claim->type->name} от {$claim->created_at->format(RUS_DATE_FORMAT)} г.";
        $this->actionsService->createAction($actionType, $actionText);
    }

}