<?php
declare(strict_types=1);

namespace App\Models\Auth;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $users;
 */
class Group extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = true;

    function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
