<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Auth\User;
use App\Models\Base\CustomPaginator;
use App\Models\Subject\Agent;
use App\Models\Subject\Creditor\Creditor;
use App\Providers\Database\AbstractProviders\AbstractProvider;

class AgentsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Agent::class;
    }
    function getList(ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId(getGroupId(), $data->orderBy)
            ->paginate($data->perPage, page: $data->page);
    }
}
