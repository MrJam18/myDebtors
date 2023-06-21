<?php
declare(strict_types=1);

namespace App\Models\Subject\Bailiff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $bailiffs;
 */
class BailiffPosition extends BaseModel
{
    protected $fillable = [
        'name'
    ];

    public $timestamps = false;

    function bailiffs(): HasMany
    {
        return $this->hasMany(Bailiff::class);
    }
}
