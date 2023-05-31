<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Subject\People\Debtor;

class DebtorsProvider extends AbstractProviders\AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = Debtor::class;
    }

    function getList(int $groupId, ListRequestData $data): CustomPaginator
    {
        if($data->orderBy->column === 'names.surname') {
            return $this->query()->byGroupId($groupId)->select('debtors.*')
                ->join('names', 'names.id', '=', 'debtors.name_id')
                ->with(['contracts' => ['creditor:id,name', 'status']])
                ->orderBy($data->orderBy->column, $data->orderBy->direction->name)
                ->paginate($data->perPage, page: $data->page);
        }
        return $this->byGroupId($groupId, $data->orderBy)->with(['name', 'contracts' => ['creditor:id,name', 'status']])->paginate($data->perPage, page: $data->page);
    }
}
