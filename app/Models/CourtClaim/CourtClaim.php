<?php
declare(strict_types=1);

namespace App\Models\CourtClaim;

use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\MoneySum;
use App\Models\Subject\Agent;
use App\Models\Subject\Court\Court;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property float $fee;
 * @property Carbon $count_date;
 * @property Carbon $status_date;
 * @property CourtClaimStatus $status;
 * @property CourtClaimType $type;
 * @property Court $court;
 * @property Contract $contract;
 * @property Agent $agent;
 * @property MoneySum $moneySum;
 *
 */
class CourtClaim extends BaseModel
{
    protected $fillable = [
        'fee',
        'count_date',
        'status_date'
    ];
    public $timestamps = true;

    function status(): BelongsTo
    {
        return $this->belongsTo(CourtClaimStatus::class);
    }
    function type(): BelongsTo
    {
        return $this->belongsTo(CourtClaimType::class);
    }
    function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }
    function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
    function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }
    function moneySum(): BelongsTo
    {
        return $this->belongsTo(MoneySum::class);
    }
}
