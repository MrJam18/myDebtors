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

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property Collection $defaultCreditors;
 * @property Collection $cessions;
 * @property Collection $contracts;
 */
class CessionGroup extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = true;

    function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function defaultCreditors(): HasMany
    {
        return $this->hasMany(Creditor::class);
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
