<?php
declare(strict_types=1);

namespace App\Models\Subject\Court;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $courts;
 */
class CourtType extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function courts(): HasMany
    {
        return $this->hasMany(Court::class, 'type_id');
    }
}
