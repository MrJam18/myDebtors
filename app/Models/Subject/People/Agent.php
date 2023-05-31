<?php
declare(strict_types=1);

namespace App\Models\Subject;

use App\Models\Address\Address;
use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\CourtClaim\CourtClaim;
use App\Models\Passport\Passport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $enclosure;
 * @property boolean $is_default;
 * @property boolean $no_show_group;
 * @property User $user;
 * @property Name $name;
 * @property Collection $courtClaims;
 * @property Address $address
 * @property Passport $passport
 */
class Agent extends BaseModel
{
    protected $fillable = [
        'enclosure',
        'is_default',
        'no_show_group'
    ];
    public $timestamps = true;

    protected $casts = [
        'is_default' => 'boolean',
        'no_show_group' => 'boolean',
    ];

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function name(): BelongsTo
    {
        return $this->belongsTo(Name::class);
    }
    function courtClaims(): HasMany
    {
        return $this->hasMany(CourtClaim::class);
    }
    function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    function passport(): BelongsTo
    {
        return $this->belongsTo(Passport::class);
    }

}
