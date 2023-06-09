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
    function search(array $attributes): static
    {
        $this->where(function(CustomBuilder $query) use(&$attributes) {
            foreach ($attributes as $column => $searchString)
            {
                $query->orWhereRaw("LOWER($column) LIKE LOWER(?)", ['%' . $searchString . '%']);
            }
        });
        return $this;
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

    function searchByFullName(string $fullName): static
    {
        $namesArray = explode(' ', $fullName, 3);
        $length = count($namesArray);
        if($length === 1) {
            $in = Name::query()->searchOne(['name', 'surname', 'patronymic'], $fullName)->select('id');
        }
        elseif($length === 2) {
            $in = Name::query()->where(function (CustomBuilder $builder) use (&$namesArray) {
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                   $builder->whereRaw($this->getSearchWhereRaw('name'), $this->getSearchBinding($namesArray[0]));
                   $builder->whereRaw($this->getSearchWhereRaw('surname'), $this->getSearchBinding($namesArray[1]));
                });
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                    $builder->whereRaw($this->getSearchWhereRaw('name'), $this->getSearchBinding($namesArray[1]));
                    $builder->whereRaw($this->getSearchWhereRaw('surname'), $this->getSearchBinding($namesArray[0]));
                });
                $builder->orWhere(function (CustomBuilder $builder) use (&$namesArray) {
                    $builder->whereRaw($this->getSearchWhereRaw('name'), $this->getSearchBinding($namesArray[0]));
                    $builder->whereRaw($this->getSearchWhereRaw('patronymic'), $this->getSearchBinding($namesArray[1]));
                });
            })->select('id');
        }
        else {
            $in = Name::query()->where('surname', $namesArray[0])
                ->where('name', $namesArray[1])
                ->where('patronymic', $namesArray[2])
                ->select('id');
        }
        $this->query->whereIn('name_id', $in);
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