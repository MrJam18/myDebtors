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

    function getListByContract(Contract $contract): Collection
    {
        $list = $contract->courtClaims;
        return $list->map(function (CourtClaim $claim) {
            $returned = $claim->toArray();
            $returned['count_date'] = $claim->count_date->format(ISO_DATE_FORMAT);
            $returned['status_date'] = $returned['status_date'] . ' г.';
            $returned['court'] = [
                'id' => $claim->court->id,
                'name' => $claim->court->name
            ];
            $returned['agent'] = [
                'id' => $claim->agent->id,
                'name' => $claim->agent->name->getFull()
            ];
            $returned = array_merge($returned, $claim->moneySum->toArray());
            $returned['id'] = $claim->id;
            return $returned;
        });
    }

    function getListForChooser(Contract $contract): Collection
    {
        return $contract->courtClaims->map(function (CourtClaim $claim) {
            $returned = $claim->toArray();
            $returned['count_date'] = $claim->count_date->format(RUS_DATE_FORMAT) . ' г.';
            $returned['status_date'] = $returned['status_date'] . ' г.';
            $returned['court'] = $claim->court->name;
            $returned['agent'] = $claim->agent->name->getFull();
            $returned = array_merge($returned, $claim->moneySum->getSumsStringArray());
            $returned['fee'] = $claim->moneySum->fee . RUS_ROUBLES_NAME;
            $returned['id'] = $claim->id;
            $returned['type'] = $claim->type->name;
            $returned['status'] = $claim->status->name;
            $returned['name'] = "{$claim->type->name} от {$claim->created_at->format(RUS_DATE_FORMAT)} г.";
            return $returned;
        });
    }

    function updateListByContract(Request $request, Contract $contract): void
    {
        $data = $request->all();
        foreach ($data['courtClaims'] as $courtClaimData) {
            if (isset($courtClaimData['id'])) {
                toConsole($courtClaimData['id']);
                $claim = CourtClaim::findWithGroupId($courtClaimData['id']);
                if ($claim->contract->id !== $contract->id) throw new ShowableException('Договор не соответствует судебному иску');
            } else {
                $claim = new CourtClaim();
                $claim->moneySum = new MoneySum();
            }
            $claim->type_id = (int)$courtClaimData['type_id'];
            $claim->count_date = $courtClaimData['count_date'];
            if ($claim->status_id !== (int)$courtClaimData['status_id']) {
                $claim->status_date = now();
                $claim->status_id = (int)$courtClaimData['status_id'];
            }
            $claim->court_id = $courtClaimData['court']['id'];
            $claim->agent_id = $courtClaimData['agent']['id'];
            $sums = $claim->moneySum;
            $sums->main = $courtClaimData['main'];
            $sums->percents = $courtClaimData['percents'];
            $sums->penalties = $courtClaimData['penalties'];
            $sums->fee = $courtClaimData['fee'];
            $sums->countSum();
            $sums->save();
            unset($claim->moneySum);
            $claim->moneySum()->associate($sums);
            $claim->contract()->associate($contract);
            $claim->is_contract_jurisdiction = $courtClaimData['is_contract_jurisdiction'];
            $claim->is_ignored_payments = $courtClaimData['is_ignored_payments'];
            $claim->user_id = Auth::id();
            $claim->save();
        }
        if(count($data['deleteIds']) !== 0) {
            $contract->courtClaims()->whereIn('id', $data['deleteIds'])->delete();
        }
        $this->actionsService->createAction(ActionTypeEnum::Change, 'Изменены судебные иски');
    }
    function deleteAllByContract(Contract $contract)
    {
        $contract->courtClaims->each(function (CourtClaim $claim) {
            $claim->delete();
            $claim->moneySum->delete();
        });
        $this->actionsService->createAction(ActionTypeEnum::Delete, 'Удалены судебные иски');
    }

}