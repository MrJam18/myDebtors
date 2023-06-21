<?php
declare(strict_types=1);

namespace App\Services;

use App\Enums\Database\ActionObjectEnum;
use App\Enums\Database\ActionTypeEnum;
use App\Models\Action\Action;
use App\Services\AbstractServices\BaseService;
use Illuminate\Support\Facades\Auth;

class ActionsService extends BaseService
{
    private int $contractId;
    private ActionObjectEnum $defaultObject;
    public function __construct(int $contractId, ActionObjectEnum $defaultObject)
    {
        $this->contractId = $contractId;
        $this->defaultObject = $defaultObject;
    }

    function createAction(ActionTypeEnum $type, string $result, ?ActionObjectEnum $object = null): Action
    {
        if(!$object) $object = $this->defaultObject;
        $result = ucfirst($result);
        $action = new Action();
        $action->type_id = $type->value;
        $action->object_id = $object->value;
        $action->result = $result;
        $action->contract_id = $this->contractId;
        $action->user()->associate(Auth::user());
        $action->save();
        return $action;
    }

}