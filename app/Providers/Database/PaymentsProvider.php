<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use App\Providers\Database\AbstractProviders\Components\enums\OrderDirection;
use App\Providers\Database\AbstractProviders\Components\OrderBy;

class PaymentsProvider extends AbstractProvider
{
    public function __construct()
    {
        $defaultOrderBy = new OrderBy('payments.created_at', OrderDirection::DESC);
        parent::__construct(Payment::class,  $defaultOrderBy);
    }

    function getList(ListRequestData $data, Contract $contract): CustomPaginator
    {
        $query = $contract->payments()->orderByData($data->orderBy)
            ->joinRelation('moneySum')
            ->leftJoinRelation('enforcementProceeding')
            ->selectRaw("
                {$this->getAsEquals('money_sums.main')},
                {$this->getAsEquals('money_sums.percents')},
                {$this->getAsEquals('money_sums.penalties')},
                {$this->getAsEquals('money_sums.sum')},
                {$this->getAsEquals('money_sums.fee')},
                {$this->getAsEqualsRusDate('payments.date')},
                {$this->getAsEquals('enforcement_proceedings.number')},
                payments.id
                ");
        if($data->search) {
            if(isRusDate($data->search)) $query->searchByRusDate(['payments.date'], $data->search);
            elseif(is_numeric($data->search)) {
                $query->searchOne([
                    'money_sums.main',
                    'money_sums.percents',
                    'money_sums.penalties',
                    'money_sums.sum'
                ], $data->search);
            }
            else {
                $query->searchOne(['enforcement_proceedings.number'], $data->search);
            }
        }
        return $query->paginate($data->perPage, page: $data->page);
    }
}