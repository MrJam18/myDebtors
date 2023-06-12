<?php
declare(strict_types=1);

namespace App\Models\Base;

use App\Exceptions\ShowableException;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Kirschbaum\PowerJoins\PowerJoins;

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
 * @method CustomBuilder|HasMany hasMany($related, $foreignKey = null, $localKey = null)
 */
class BaseModel extends Model
{
    use PowerJoins;
    public function newEloquentBuilder($query): CustomBuilder
    {
        return new CustomBuilder($query);
    }
    public function updateInnerModel(string $column, mixed $value): void
    {
        if(str_contains($column, '.')) {
            $column = explode('.', $column);
            $last = array_pop($column);
            $innerModel = $this;
            foreach ($column as $item) {
                if ($item === 'user') throw new Exception('access denied for user update');
                $innerModel = $innerModel->$item;
            }
            $innerModel->$last = $value;
            $innerModel->save();
        }
        else {
            $this->$column = $value;
            $this->save();
        }
    }

    /**
     * @throws ShowableException
     */
    static function findWithGroupId(int $id, $columns = ['*']): static | Collection | null
    {
        $result = static::query()->find($id, $columns);
        if($result && $result->user->group->id !== getGroupId()) throw new ShowableException('Вы не имеете права на изменение/получение данной сущности');
        return $result;
    }
}
