<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use App\Providers\Database\AbstractProviders\Components\enums\OrderDirection;
use App\Providers\Database\AbstractProviders\Components\OrderBy;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class ContractsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Contract::class;
    }

    function getLimitations(ListRequestData $data): CustomPaginator
    {
        $deadline = Carbon::now()->subYears(2);
        return $this->byGroupId(getGroupId(), new OrderBy('due_date', OrderDirection::ASC))->where('due_date', '>=', $deadline)->with(['creditor:id,name,short', 'debtor:id,name_id' => ['name']])->paginate($data->perPage, ['due_date', 'issued_date', 'id', 'creditor_id', 'debtor_id'], page: $data->page);
    }

}
