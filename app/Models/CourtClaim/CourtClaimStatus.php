<?php
declare(strict_types=1);

namespace App\Models\CourtClaim;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $courtClaims;
 */
class CourtClaimStatus extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function courtClaims(): HasMany
    {
        return $this->hasMany(CourtClaim::class);
    }
}
