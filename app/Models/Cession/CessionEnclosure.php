<?php
declare(strict_types=1);

namespace App\Models\Cession;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property string $name;
 * @property Cession $cession;
 */
class CessionEnclosure extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function cession(): BelongsTo
    {
        return $this->belongsTo(Cession::class);
    }
}
