<?php
declare(strict_types=1);

namespace App\Models\Auth;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $users;
 */
class UserRole extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
