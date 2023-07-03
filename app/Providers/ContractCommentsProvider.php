<?php

declare(strict_types=1);

namespace App\Providers;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractComment;
use App\Providers\Database\AbstractProviders\AbstractProvider;

class ContractCommentsProvider extends AbstractProvider
{

    public function __construct()
    {
        parent::__construct(ContractComment::class);
    }

    /**
     * @throws \Exception
     */
    function getList(ListRequestData $data, Contract $contract): CustomPaginator
    {
        $query = $contract->comments()->joinRelation('user.name')
            ->select(['contract_comments.*', 'names.surname as user_surname', 'names.name as user_name', 'names.patronymic as user_patronymic', 'users.id as user_id'])
            ->orderByData($data->orderBy);
        if($data->search) {
            if(isRusDate($data->search)) {
                $query->searchByRusDate(['contract_comments.created_at'], $data->search);
            }
            else $query->search(['contract_comments.text' => $data->search]);
        }
        return $query->paginate($data->perPage, page: $data->page);
    }
}
