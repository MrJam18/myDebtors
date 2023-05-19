<?php
declare(strict_types=1);

namespace App\Models\Subject;

use App\Models\Address\Address;
use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\Passport\Passport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property Carbon $birth_date;
 * @property string $birth_place;
 * @property Passport $passport;
 * @property Address $address;
 * @property User $user;
 * @property Name $name;
 * @property Collection $contracts;
 */
class Debtor extends BaseModel
{
    protected $fillable = [
        'birth_date',
        'birth_place',
        'name_id'
    ];
    protected $casts = [
        'birth_date' => RUS_DATE_CAST
    ];
    public $timestamps = true;

    function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    function passport(): BelongsTo
    {
        return $this->belongsTo(Passport::class);
    }
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function name(): BelongsTo
    {
        return $this->belongsTo(Name::class);
    }
    function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
