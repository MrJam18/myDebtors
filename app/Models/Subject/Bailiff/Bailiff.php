<?php
declare(strict_types=1);

namespace App\Models\Subject\Bailiff;

use App\Models\Subject\People\Name;
use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property Name $name;
 * @property BailiffPosition $position;
 * @property BailiffDepartment $department;
 */
class Bailiff extends BaseModel
{
    protected $fillable = [
        'name',
        'surname',
        'patronymic'
    ];
    public $timestamps = true;

    function name(): BelongsTo
    {
        return $this->belongsTo(Name::class);
    }
    function position(): BelongsTo
    {
        return $this->belongsTo(BailiffPosition::class);
    }
    function department(): BelongsTo
    {
        return $this->belongsTo(BailiffDepartment::class);
    }
}
