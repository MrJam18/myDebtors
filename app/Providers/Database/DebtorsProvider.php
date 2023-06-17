<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomBuilder;
use App\Models\Base\CustomPaginator;
use App\Models\Subject\People\Debtor;
use Illuminate\Support\Collection;
use function Symfony\Component\String\s;

class DebtorsProvider extends AbstractProviders\AbstractProvider
{
    public function __construct()
    {
        parent::__construct(Debtor::class);
    }

    function getList(int $groupId, ListRequestData $data): CustomPaginator
    {
        $nameUsed = false;
        $query = $this->byGroupId($groupId, $data->orderBy);
        if($data->search) {
            if(preg_match('~\d+~', $data->search)) {
                $searchArray = new Collection(explode(' ', $data->search), 6);
                $searchArray->filter(function (string $word, int $index) use (&$searchArray) {
                    $word = strtolower($word);
                    if(str_contains('№', $word)) {
                        if($word === "№") return false;
                        $word = str_replace('№', '', $word);
                    }
                    else {
                        if($word === 'от') return false;
                        if($word === 'договор') return false;
                        if($word === "г.") return false;
                    }
                    $searchArray[$index] = $word;
                    return true;
                });
                if($searchArray->count() >= 2) {
                    $searchArray->first(function (string $word, int $index) use ($searchArray, $query) {
                        if(isRusDate($word)) {
                            $searchArray->splice($index);
                            $query->whereHas('contracts', function (CustomBuilder $builder) use ($word, $searchArray, $query) {
                                $builder->searchByRusDate(['issued_date'], $word);
                                $builder->search(['number' => $searchArray[0]]);
                                return true;
                            });
                        }
                    });
                }
                else {
                    if(isRusDate($searchArray[0])) {
                        $query->whereHas('contracts', function (CustomBuilder $builder) use ($searchArray) {
                            $builder->searchByRusDate(['issued_date'], $searchArray[0]);
                        });
                    }
                    else {
                        $query->whereHas('contracts', function (CustomBuilder $builder) use($searchArray) {
                            $builder->search([
                               'number' => $searchArray[0]
                            ]);
                        });
                    }
                }
            }
            else {
                $nameUsed = true;
                $query->searchByFullName($data->search);
            }
        }
        if($data->orderBy->column === 'names.surname') {
            $query->select('debtors.*')
                ->with(['contracts' => ['creditor:id,name', 'status']])
                ->orderBy($data->orderBy->column, $data->orderBy->direction->name);
            if(!$nameUsed) $query->join('names', 'names.id', '=', 'debtors.name_id');
            return $query->paginate($data->perPage, page: $data->page);
        }
        elseif($data->orderBy->column === 'contracts.issued_date') {
            return $query->joinRelation('contracts.creditor')->joinRelation('contracts.status')
                ->select(['debtors.*', 'contracts.issued_date as contract_issued_date', 'contracts.number as contract_number', 'contracts.id as contract_id', 'contract_statuses.name as contract_status_name', 'creditors.name as creditor_name'])
                ->with(['name'])
                ->orderByData($data->orderBy)
                ->paginate($data->perPage, page: $data->page);
        }
        return $query->with(['name', 'contracts' => ['creditor:id,name', 'status']])->paginate($data->perPage, page: $data->page);
    }

}
