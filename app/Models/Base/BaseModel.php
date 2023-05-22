<?php
declare(strict_types=1);

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 * @method static Builder|BaseModel newModelQuery()
 * @method static Builder|BaseModel newQuery()
 * @method static static first(string[] $columns = ['*'])
 * @method static Collection all(string[] $columns = ['*'])
 * @method static static firstOrCreate(array $attributes = [], array $values = [])
 * @method static static firstOrNew(array $attributes = [], array $values = [])
 * @method static static find(int $id, array $columns = ['*'])
 * @method static CustomBuilder query()
 */
class BaseModel extends Model
{
    public function newEloquentBuilder($query): CustomBuilder
    {
        return new CustomBuilder($query);
    }
}
