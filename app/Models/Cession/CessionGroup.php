<?php
declare(strict_types=1);

namespace App\Models\Cession;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\Subject\Creditor\Creditor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property Creditor $defaultCreditor;
 * @property Collection $cessions;
 * @property Collection $contracts;
 * @property User $user;
 */
class CessionGroup extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = true;

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function defaultCreditor(): HasOne
    {
        return $this->hasOne(Creditor::class, 'default_cession_id');
    }
    function cessions(): HasMany
    {
        return $this->hasMany(Cession::class);
    }
    function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
