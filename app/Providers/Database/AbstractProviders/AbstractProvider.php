<?php
declare(strict_types=1);

namespace App\Providers\Database\AbstractProviders;

use App\Models\Auth\User;
use App\Models\Base\CustomBuilder;
use App\Providers\Database\AbstractProviders\Components\enums\OrderDirection;
use App\Providers\Database\AbstractProviders\Components\OrderBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\DB;

abstract class AbstractProvider
{
    protected string $model;
    protected OrderBy $defaultOrderBy;
    protected string $table;

    public function __construct(string $model, ?OrderBy $defaultOrderBy = null)
    {
        $this->table = (new $model())->getTable();
        $this->model = $model;
        $this->defaultOrderBy = $defaultOrderBy ?? new OrderBy($this->table . '.created_at', OrderDirection::DESC);
    }


    protected function getOrdered(?OrderBy $orderBy = null): CustomBuilder
    {
        if(!$orderBy) $orderBy = $this->defaultOrderBy;
        return $this->query()->orderBy($orderBy->column, $orderBy->direction->name);
    }

    protected function byUserId(int $userId, ?OrderBy $orderBy = null): CustomBuilder
    {
        return $this->getOrdered($orderBy)->where('user_id', '=', $userId);
    }

    protected function byGroupId(int $groupId, ?OrderBy $orderBy = null): CustomBuilder
    {
        $in = User::query()->where('group_id', '=', $groupId)->get('id')->map(function (User $user) {
            return $user->id;
        });
        return $this->getOrdered($orderBy)->whereIn($this->table . '.user_id', $in);
    }
    protected function getAsEquals(string $value): string
    {
        return "$value as `$value`";
    }
    protected function getAsEqualsRusDate(string $value): string
    {
        return "DATE_FORMAT($value, '%d.%m.%Y') as `$value`";
    }
    protected function getRusDate(string $value, string $as): string
    {
        return "DATE_FORMAT($value, '%d.%m.%Y') as `$as`";
    }


    /** @noinspection PhpUndefinedMethodInspection */
    protected function query(): CustomBuilder
    {
        return $this->model::query();
    }

}
