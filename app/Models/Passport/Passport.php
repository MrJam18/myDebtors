<?php
declare(strict_types=1);

namespace App\Models\Passport;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $series;
 * @property string $number;
 * @property string $issued_by;
 * @property Carbon $issued_date;
 * @property string $gov_unit_code;
 * @property PassportType $type;
 */
class Passport extends BaseModel
{
    protected $fillable = [
        'series',
        'number',
        'issued_by',
        'issued_date',
        'gov_unit_code'
    ];
    public $timestamps = true;

    protected $casts = [
        'issued_date' => 'date:' . ISO_DATE_FORMAT,
    ];

    function type(): BelongsTo
    {
        return $this->belongsTo(PassportType::class);
    }
}
