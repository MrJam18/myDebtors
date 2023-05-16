<?php
declare(strict_types=1);

namespace App\Models\Address;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $countries;
 */
class Country extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function countries(): HasMany
    {
        return $this->hasMany(Region::class);
    }
}
