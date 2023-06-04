<?php

declare(strict_types=1);

namespace App\Providers\Database\Contracts;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractComment;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Illuminate\Support\ServiceProvider;

class ContractCommentsProvider extends AbstractProvider
{

    public function __construct()
    {
        parent::__construct();
        $this->model = ContractComment::class;
    }

    /**
     * @throws \Exception
     */
    function getList(ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId(getGroupId(), $data->orderBy)->with(['contracts_comments' => [
            'contract_id:id,number', 'user_id:id,name', 'file_id:id,url'
        ]])->paginate($data->perPage, page: $data->page);
    }
}