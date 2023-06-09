<?php

namespace App\Models\EnforcementProceeding;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $enforcementProceedings;
 */
class EnforcementProceedingStatus extends BaseModel
{

    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function enforcementProceedings(): HasMany
    {
        return $this->hasMany(EnforcementProceeding::class);
    }
}
