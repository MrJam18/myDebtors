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
        parent::__construct(Debtor::class);
    }

    function getList(ListRequestData $data): CustomPaginator
    {
        $nameUsed = false;
        $query =  $this->byGroupId(getGroupId(), $data->orderBy)
            ->joinRelation('address.settlement')
            ->with(['address' => ['country', 'region', 'area', 'settlement', 'street']])
            ->select(['names.*', 'debtors.id', 'debtors.created_at', 'debtors.birth_date', 'debtors.address_id']);
        if($data->search) {
            if(isRusDate($data->search)) $query->searchByRusDate(['debtors.birth_date'], $data->search);
            else {
                $query->searchByFullName($data->search);
                $nameUsed = true;
            }
        }
        if(!$nameUsed) $query->joinRelation('name');
        return $query->paginate($data->perPage, page: $data->page);
    }

}
