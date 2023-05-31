<?php
declare(strict_types=1);

namespace App\Models\Address;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Region $region;
 * @property Collection $settlements;
 * @property Collection $addresses;
 */
class Area extends BaseModel
{
    protected $fillable = [
        'name',
        'region_id'
    ];
    public $timestamps = false;

    function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
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
