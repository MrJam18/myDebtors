<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Cession\CessionGroup;
use App\Providers\Database\AbstractProviders\AbstractProvider;

class CessionsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct();
        $this->model = CessionGroup::class;
    }

    function getList(ListRequestData $data): CustomPaginator
    {

        $builder = $this->byGroupId(getGroupId(), $data->orderBy)->with(['cessions' => [
            'assignee:id,name', 'assignor:id,name'
        ]]);
        if ($data->search) $builder->searchOne(['name'], $data->search);
        return $builder->paginate($data->perPage, page: $data->page);
    }
}