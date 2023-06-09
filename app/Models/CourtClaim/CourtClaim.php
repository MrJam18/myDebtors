<?php
declare(strict_types=1);

namespace App\Models\CourtClaim;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\MoneySum;
use App\Models\Subject\Court\Court;
use App\Models\Subject\People\Agent;
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
 * @property boolean $is_contract_jurisdiction;
 * @property boolean $is_ignored_payments;
 * @property User $user;
 * @property null|Carbon $sending_date;
 *
 */
class CourtClaim extends BaseModel
{
    protected $fillable = [
        'fee',
        'count_date',
        'status_date',
        'is_contract_jurisdiction',
        'is_ignored_payments',
        'sending_date'
    ];
    public $timestamps = true;

    protected $casts = [
      'count_date' => RUS_DATE_CAST,
      'status_date' => RUS_DATE_CAST,
      'sending_date' => RUS_DATE_CAST,
      'is_contract_jurisdiction' => 'boolean',
      'is_ignored_payments' => 'boolean'
    ];

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
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
