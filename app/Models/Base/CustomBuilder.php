<?php
declare(strict_types=1);

namespace App\Models\Base;

use App\Models\Auth\User;
use App\Models\Subject\People\Name;
use App\Providers\Database\AbstractProviders\Components\OrderBy;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Expression;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Schema;

/**
 * @method self joinRelation(string $relation,Closure $callback = null, string $type = 'inner', $through = false, Builder $relatedQuery = null, $morphTypes = ['*'])
 */
class CustomBuilder extends Builder
{
    function paginate($perPage = null, $columns = ['*'], $pageName = 'page', $page = null): CustomPaginator
    {
        $page = $page ?: Paginator::resolveCurrentPage($pageName);
        $total = $this->toBase()->getCountForPagination();

        $perPage = ($perPage instanceof Closure
            ? $perPage($total)
            : $perPage
        ) ?: $this->model->getPerPage();

        $results = $total
            ? $this->forPage($page, $perPage)->get($columns)
            : $this->model->newCollection();

        return new CustomPaginator($results, $total, $perPage, $page, [
            'path' => Paginator::resolveCurrentPath(),
            'pageName' => $pageName,
            ]);
    }

    /**
     * @param array<string, string> $attributes
     * @return $this
     */
    function search(array $attributes, bool $notLike = false): static
    {
        $operator = $notLike ? 'NOT LIKE' : 'LIKE';
        $this->where(function(CustomBuilder $query) use(&$attributes, $operator) {
            foreach ($attributes as $column => $searchString)
            {
                $query->orWhereRaw("LOWER($column) $operator LOWER(?)", ['%' . $searchString . '%']);
            }
        });
        return $this;
    }
    function searchByRusDate(array $byColumns, string $searchDate): static
    {
        $datesArray = explode('.', $searchDate, 3);
        $date = '';
        foreach ($datesArray as $item) {
            $date = '-' . $item . $date;
        }
        $date = substr($date, 1);
        return $this->searchOne($byColumns, $date);
    }

    function searchOne(array $byColumns, string $search): static
    {
        $this->where(function(CustomBuilder $query) use(&$byColumns, $search) {
            foreach ($byColumns as $column)
            {
                $query->orWhereRaw("LOWER($column) LIKE LOWER(?)", ['%' . $search . '%']);
            }
        });
        return $this;
    }

    function byGroupId(int $groupId): static
    {
        $in = User::query()->where('group_id', '=', $groupId)->select('id');
        $this->query->whereIn('user_id', $in);
        return $this;
    }

    function searchByFullName(string $fullName, string $table = null): static
    {
        $namesArray = explode(' ', $fullName, 3);
        $length = count($namesArray);
        if($length === 1) {
            $this->searchOne(['names.name', 'names.surname', 'names.patronymic'], $fullName);
        }
        elseif($length === 2) {
            $this->where(function (CustomBuilder $builder) use (&$namesArray) {
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                   $builder->whereRaw($this->getSearchWhereRaw('names.name'), $this->getSearchBinding($namesArray[0]));
                   $builder->whereRaw($this->getSearchWhereRaw('names.surname'), $this->getSearchBinding($namesArray[1]));
                });
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                    $builder->whereRaw($this->getSearchWhereRaw('names.name'), $this->getSearchBinding($namesArray[1]));
                    $builder->whereRaw($this->getSearchWhereRaw('names.surname'), $this->getSearchBinding($namesArray[0]));
                });
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                    $builder->whereRaw($this->getSearchWhereRaw('names.name'), $this->getSearchBinding($namesArray[0]));
                    $builder->whereRaw($this->getSearchWhereRaw('names.patronymic'), $this->getSearchBinding($namesArray[1]));
                });
            });
        }
        else {
           $this->where('names.surname', $namesArray[0])
                ->where('names.name', $namesArray[1])
                ->whereRaw($this->getSearchWhereRaw('names.patronymic'), $this->getSearchBinding($namesArray[2]));
        }
        $joinTable = $table ?? $this->model->getTable();
        $this->join('names', 'names.id', '=', $joinTable . '.name_id');
        return $this;
    }
    private function getSearchWhereRaw(string $column): string
    {
        return "LOWER($column) LIKE LOWER(?)";
    }
    private function getSearchBinding(string $value): array
    {
        return ['%' . $value . '%'];
    }
    function orderByData(?OrderBy $orderBy = null): static
    {
        if($orderBy) $this->orderBy($orderBy->column, $orderBy->direction->name);
        return $this;
    }
}