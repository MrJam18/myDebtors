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
 * @property Area $area;
 * @property Region $region;
 * @property Collection $streets;
 * @property Collection $addresses;
 */
class Settlement extends BaseModel
{
    protected $fillable = [
        'name',
        'area_id',
        'region_id'
    ];
    public $timestamps = false;

    function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
    function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
    function streets(): HasMany
    {
        return $this->hasMany(Street::class);
    }
    function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
