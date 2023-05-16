<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Action\Action;
use App\Models\Base\CustomPaginator;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ActionsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Action::class;
    }

    function getLastActions(int $userId, ListRequestData $data): CustomPaginator
    {
        return $this->byUserId($userId)->with(['action_type', 'action_object', 'contract' => ['debtor' => ['name']]])
            ->paginate($data->perPage, page: $data->page);
    }
}
