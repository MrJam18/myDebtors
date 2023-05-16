<?php
declare(strict_types=1);

namespace App\Models\Base;

use App\Models\Auth\User;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\Paginator;

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
        foreach ($attributes as $column => $searchString)
        {
            $this->whereRaw("LOWER($column) LIKE LOWER(?)", ['%' . $searchString . '%'], 'OR');
        }
        return $this;
    }

    function byGroupId(int $groupId): static
    {
        $in = User::query()->where('group_id', '=', $groupId)->get('id')->map(function (User $user) {
            return $user->id;
        });
        $this->query->whereIn('user_id', $in);
        return $this;
    }
}