<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Action\Action;
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
                'createdAt' => $action->created_at,
                'id' => $action->id,
                'result' => $action->result,
                'actionType' => $action->type->name,
                'actionObject' => $action->object->name,
                'contractId' => $action->contract->id
            ];
        });
        return $paginator->jsonResponse($list);
    }
}
