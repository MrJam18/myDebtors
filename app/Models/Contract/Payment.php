<?php
declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Base\BaseModel;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\MoneySum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property Carbon $date;
 * @property Contract $contract;
 * @property MoneySum $moneySum;
 * @property EnforcementProceeding|null $enforcementProceeding;
 */
class Payment extends BaseModel
{
    protected $fillable = [
        'date'
    ];
    protected $casts = [
        'date' => 'date:' . ISO_DATE_FORMAT
    ];
    public $timestamps = true;

    function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
    function moneySum(): BelongsTo
    {
        return $this->belongsTo(MoneySum::class);
    }
    function enforcementProceeding(): BelongsTo
    {
        return $this->belongsTo(EnforcementProceeding::class);
    }
}
