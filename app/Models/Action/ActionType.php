<?php
declare(strict_types=1);

namespace App\Models\Action;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $actions;
 */
class ActionType extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }
}
