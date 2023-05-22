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
 * @property Settlement $settlement;
 * @property Collection $addresses;
 */
class Street extends BaseModel
{
    protected $fillable = [
        'name',
        'settlement_id'
    ];
    public $timestamps = false;

    function settlement(): BelongsTo
    {
        return $this->belongsTo(Settlement::class);
    }
    function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
