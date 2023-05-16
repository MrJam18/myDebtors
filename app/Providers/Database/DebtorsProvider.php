<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Subject\Debtor;

class DebtorsProvider extends AbstractProviders\AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Debtor::class;
    }

    function getList(int $groupId, ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId($groupId, $data->orderBy)->with(['name', 'contracts' => ['creditor:id,name', 'status']])->paginate($data->perPage, page: $data->page);
    }
}
