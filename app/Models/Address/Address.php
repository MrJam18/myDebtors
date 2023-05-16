<?php
declare(strict_types=1);

namespace App\Models\Address;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $postal_code;
 * @property string | null $block;
 * @property string | null $flat;
 * @property string $house;
 * @property Region $region;
 * @property Settlement $settlement;
 * @property Street $street;
 * @property Area | null $area;
 * @property Country $country;
 */
class Address extends BaseModel
{
    protected $fillable = [
        'postal_code',
        'block',
        'flat',
        'house'
    ];
    public $timestamps = true;

    function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
    function settlement(): BelongsTo
    {
        return $this->belongsTo(Settlement::class);
    }
    function street(): BelongsTo
    {
        return $this->belongsTo(Street::class);
    }
    function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
    function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
