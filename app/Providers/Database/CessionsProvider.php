<?php
declare(strict_types=1);

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\Cession\CessionGroup;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use stdClass;

class CessionsProvider extends AbstractProvider
{
    public function __construct()
    {
        parent::__construct(CessionGroup::class);
    }

    function getList(ListRequestData $data): CustomPaginator
    {

        $builder = $this->byGroupId(getGroupId(), $data->orderBy)->with(['cessions' => [
            'assignee:id,name', 'assignor:id,name'
        ]])
            ->joinSub($this->getLastCessionQuery(), 'ranked_table', 'ranked_table.cession_group_id', 'cession_groups.id')
            ->join('creditors as assignee_table', 'ranked_table.assignee_id', 'assignee_table.id')
            ->join('creditors as assignor_table', 'ranked_table.assignor_id', 'assignor_table.id')
            ->selectRaw("{$this->getAsEquals('cession_groups.name')}, {$this->getAsEquals('assignee_table.short')}, {$this->getAsEquals('assignor_table.short')}, {$this->getAsEqualsRusDate('ranked_table.transfer_date')}, cession_groups.id as idd, {$this->getAsEqualsRusDate('cession_groups.created_at')}");
        if ($data->search) $builder->searchOne(['cession_groups.name'], $data->search);
        return $builder->paginate($data->perPage,
            [$this->getAsEquals('cession_groups.name'),$this->getAsEquals('assignee_table.short'),$this->getAsEquals('assignor_table.short'), $this->getAsEqualsRusDate('ranked_table.transfer_date'), 'cession_groups.id as idd', $this->getAsEqualsRusDate('cession_groups.created_at')],
            page: $data->page);
    }
    function getSearchList(string $search, ?int $creditorId = null): Collection
    {
        $builder = $this->byGroupId(getGroupId())
            ->search(['name' => $search])
            ->limit(5);
        if($creditorId) {
            $filteredCessionsGroups = $this->getLastCessionQuery()->where('ranked_table.assignor_id', '=', $creditorId)
                ->get('ranked_table.cession_group_id');
            $filteredCessionsGroups = $filteredCessionsGroups->map(fn(stdClass $data)=> $data->cession_group_id);
            $builder->whereIn('cession_groups.id', $filteredCessionsGroups);
        }
        return $builder->get(['cession_groups.id', 'cession_groups.name']);
    }
    private function getLastCessionQuery(): Builder
    {
        $rankedQuery = DB::table('cessions')->selectRaw(
            '*, RANK() over (PARTITION BY cession_group_id order by transfer_date DESC) as transfer_rank'
        );
        return DB::query()
            ->from($rankedQuery, 'ranked_table')
            ->where('ranked_table.transfer_rank', '=', 1);
    }
}