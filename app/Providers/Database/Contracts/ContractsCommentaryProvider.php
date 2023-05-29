<?php

declare(strict_types=1);

namespace App\Providers\Database\Contracts;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractCommentary;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Illuminate\Support\ServiceProvider;

class ContractsCommentaryProvider extends AbstractProvider
{

    public function __construct()
    {
        parent::__construct();
        $this->model = ContractCommentary::class;
    }

    function getList(ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId(getGroupId(), $data->orderBy)->with(['contracts_commentary' => [
            'contract_id:id,number', 'comm:id,name'
        ]])->paginate($data->perPage, page: $data->page);
    }
}
