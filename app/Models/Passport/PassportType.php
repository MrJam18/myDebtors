<?php
declare(strict_types=1);

namespace App\Models\Passport;

use App\Models\Address\Address;
use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $passports;
 */
class PassportType extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function passports(): HasMany
    {
        return $this->hasMany(Address::class, 'type_id');
    }
}
