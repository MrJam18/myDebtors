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
use Illuminate\Support\Collection;

class ContractsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct(Contract::class);
    }

    function getLimitations(ListRequestData $data): CustomPaginator
    {
        $deadline = Carbon::now()->subYears(2);
        return $this->byGroupId(getGroupId(), new OrderBy('due_date', OrderDirection::ASC))->where('due_date', '<=', $deadline)->with(['creditor:id,name,short', 'debtor:id,name_id' => ['name']])->paginate($data->perPage, ['due_date', 'issued_date', 'id', 'creditor_id', 'debtor_id'], page: $data->page);
    }

    function getList(ListRequestData $data): CustomPaginator
    {
        $nameUsed = false;
        $query = $this->byGroupId(getGroupId(), $data->orderBy)
            ->joinRelation('creditor')
            ->joinRelation('debtor')
            ->joinRelation('status');
        if($data->search) {
            if(!preg_match('~\d+~', $data->search)) {
                $nameUsed = true;
                $query->searchByFullName($data->search, 'debtors');
            }
            else {
                $searchArray = new Collection(explode(' ', $data->search, 6));
                $searchArray->filter(function (string $word, int $index) use (&$searchArray) {
                    $word = strtolower($word);
                    if (str_contains('№', $word)) {
                        if ($word === "№") return false;
                        $word = str_replace('№', '', $word);
                    } else {
                        if ($word === 'от') return false;
                        if ($word === 'договор') return false;
                        if ($word === "г.") return false;
                    }
                    $searchArray[$index] = $word;
                    return true;
                });
                if ($searchArray->count() >= 2) {
                    $searchArray->first(function (string $word, int $index) use ($searchArray, $query) {
                        if (isRusDate($word)) {
                            $searchArray->splice($index);
                            $query->searchByRusDate(['contracts.issued_date'], $word);
                            $query->search(['contracts.number' => $searchArray[0]]);
                            return true;
                        }
                        else return false;
                    });
                }
                else {
                    if (isRusDate($searchArray[0])) {
                        $query->searchByRusDate(['contracts.issued_date'], $searchArray[0]);
                    } else {
                        $query->search(['contracts.number' => $searchArray[0]]);
                    }
                }
            }
        }
        if(!$nameUsed) $query->joinRelation('debtor.name');
        if($data->filter) {
            foreach ($data->filter as $filterEl) {
                if($filterEl->operator === 'LIKE' || $filterEl->operator === 'NOT LIKE') {
                    $query->search([$filterEl->key => $filterEl->value], $filterEl->operator === 'NOT LIKE');
                }
                else {
                    $query->where($filterEl->key, $filterEl->operator, $filterEl->value);
                }
            }
        }
        $query->selectRaw("contracts.number, contracts.issued_date, contracts.id, names.surname, names.name, names.patronymic, creditors.short, creditors.name as creditor_name, contract_statuses.name as status_name");
        return $query->paginate($data->perPage, page: $data->page);
    }

}
