<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Action\Action;
use App\Models\Contract\Contract;
use App\Providers\Database\ActionsProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ActionController extends AbstractController
{

    function getLastActionsList(PaginateRequest $request, ActionsProvider $provider): array | JsonResponse
    {
        $data = $request->validated();
        $userId = Auth::id();
        $paginator = $provider->getLastActions($userId, $data);
        $list = $paginator->items()->map(function (Action $action){
            return [
                'debtor' => $action->contract->debtor->name->getFull(),
                'createdAt' => $action->created_at->format(RUS_DATE_FORMAT),
                'id' => $action->id,
                'result' => $action->result,
                'actionType' => $action->type->name,
                'actionObject' => $action->object->name,
                'contractId' => $action->contract->id
            ];
        });
        return $paginator->jsonResponse($list);
    }
    function getList(Contract $contract, PaginateRequest $request, ActionsProvider $provider): array
    {
        $paginator = $provider->getList($request->validated(), $contract);
        $list = $paginator->items()->map(function (Action $action) {
            return [
                'created_at' => $action->created_at->format(RUS_DATE_TIME_FORMAT),
                'idd' => $action->id,
                'result' => $action->result,
                'action_types.name' => $action->type->name,
                'action_objects.name' => $action->object->name,
                'names.surname' => $action->user->name->initials()
            ];
        });
        return $paginator->jsonResponse($list);

    }
}
