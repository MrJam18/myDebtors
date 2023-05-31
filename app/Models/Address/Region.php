<?php
declare(strict_types=1);

namespace App\Models\Address;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $areas;
 * @property Collection $settlements;
 * @property Collection $addresses;
 * @property Country $country;
 */
class Region extends BaseModel
{
    protected $fillable = [
        'name',
        'country_id'
    ];
    public $timestamps = false;

    function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
    function areas(): HasMany
    {
        return $this->hasMany(Area::class);
    }
    function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
    }
    function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
