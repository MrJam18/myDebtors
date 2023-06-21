<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Action\Action;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Providers\Database\AbstractProviders\AbstractProvider;

class ActionsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct(Action::class);

    }

    function getLastActions(int $userId, ListRequestData $data): CustomPaginator
    {
        return $this->byUserId($userId)->with(['type', 'object', 'contract' => ['debtor' => ['name']]])
            ->paginate($data->perPage, page: $data->page);
    }
    function getList(ListRequestData $data, Contract $contract): CustomPaginator
    {
        $query = $contract->actions()->orderByData($data->orderBy)
            ->joinRelation('type')
            ->joinRelation('object')
            ->joinRelation('user.name')
            ->with(['type', 'object', 'user' => ['name']]);
        if($data->search) {
            if(containRusDate($data->search)) {
                $query->searchByRusDate(['actions.created_at'], $data->search);
            }
            else {
                $query->searchOne(['result', 'action_types.name', 'action_objects.name', 'names.surname'], $data->search);
            }
        }
        return $query->paginate($data->perPage, page: $data->page);
    }
}
