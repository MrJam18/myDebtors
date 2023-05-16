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

    public function __construct(?OrderBy $defaultOrderBy = null)
    {
        $this->defaultOrderBy = $defaultOrderBy ?? new OrderBy('created_at', OrderDirection::DESC);
    }

//
//    function getAll(): Collection
//    {
//        return $this->query()->with('category')->get();
//    }
//
//    protected function getRusDate(string $field): Expression
//    {
//        if(preg_match('/./', $field)) {
//            $as = explode('.', $field);
//            $as = $as[count($as) - 1];
//        }
//        else $as = $field;
//        return DB::raw("date_format($field, '%d.%m.%Y') as $as");
//    }
//    protected function rusDateTime(string $field): Expression
//    {
//        if(preg_match('/./', $field)) {
//            $as = explode('.', $field);
//            $as = $as[count($as) - 1];
//        }
//        else $as = $field;
//        return DB::raw("date_format($field, '%d.%m.%Y %H:%i:%s') as $as");
//    }


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
        return $this->getOrdered($orderBy)->whereIn('user_id', $in);
    }


    /** @noinspection PhpUndefinedMethodInspection */
    protected function query(): CustomBuilder
    {
        return $this->model::query();
    }

}
