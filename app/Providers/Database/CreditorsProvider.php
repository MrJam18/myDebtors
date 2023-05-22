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
        $query = $this->byGroupId($groupId, $data->orderBy)->with(['type']);
        if($data->search) {
            $search = $data->search;
            if(is_numeric($search)) {
                $query->search(['court_identifier'  => $search]);
            }
            else {
                $query->search([
                    'name' => $search,
                    'short' => $search
                ]);
            }
        }
        toConsole($query->toSql());
        return $query->paginate($data->perPage, page: $data->page);
    }
}