<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Subject\Creditor\Creditor;
use App\Providers\Database\AbstractProviders\AbstractProvider;

class CreditorsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Creditor::class;
    }
    function getList(int $groupId, ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId($groupId)->with(['type'])->paginate($data->perPage, page: $data->page);
    }
}