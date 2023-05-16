<?php
declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Action\Action;
use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Cession\CessionGroup;
use App\Models\CourtClaim\CourtClaim;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Debtor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $number;
 * @property float $issued_sum;
 * @property Carbon $issued_date;
 * @property Carbon $due_date;
 * @property float $percent;
 * @property float $penalty;
 * @property Carbon $status_changed_at;
 * @property boolean $is_contract_jurisdiction;
 * @property ContractStatus $status;
 * @property ContractType $type;
 * @property User $user;
 * @property CessionGroup $cession;
 * @property Creditor $creditor;
 * @property Debtor $debtor;
 * @property ExecutiveDocument $executiveDocument;
 * @property Collection $payments;
 * @property Collection $courtClaims;
 * @property Collection $actions;
 */
class Contract extends BaseModel
{
    protected $fillable = [
        'number',
        'issued_date',
        'issued_sum',
        'due_date',
        'percent',
        'penalty',
        'status_changed_at',
        'is_contract_jurisdiction'
    ];
    protected $casts = [
        'issued_date' => RUS_DATE_CAST,
        'due_date' => RUS_DATE_CAST
    ];
    public $timestamps = true;

    function status(): BelongsTo
    {
        return $this->belongsTo(ContractStatus::class);
    }
    function type(): BelongsTo
    {
        return $this->belongsTo(ContractType::class);
    }
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function cession(): BelongsTo
    {
        return $this->belongsTo(CessionGroup::class);
    }
    function creditor(): BelongsTo
    {
        return $this->belongsTo(Creditor::class);
    }
    function debtor(): BelongsTo
    {
        return $this->belongsTo(Debtor::class);
    }
    function executiveDocument(): HasOne
    {
        return $this->hasOne(ExecutiveDocument::class);
    }
    function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
    function courtClaims(): HasMany
    {
        return $this->hasMany(CourtClaim::class);
    }
    function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

}
