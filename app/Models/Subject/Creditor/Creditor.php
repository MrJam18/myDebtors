<?php
declare(strict_types=1);

namespace App\Models\Subject\Creditor;

use App\Models\Address\Address;
use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Cession\Cession;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\Requisites\Requisites;
use App\Models\Traits\RusTimeStamps;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $short;
 * @property string $name;
 * @property string $court_identifier;
 * @property User $user;
 * @property CreditorType $type;
 * @property Address $address;
 * @property CessionGroup | null $defaultCession;
 * @property Requisites $requisites;
 * @property Collection $cessionsAsAssignor;
 * @property Collection $cessionsAsAssignee;
 * @property Collection $contracts;
 */
class Creditor extends BaseModel
{
    use RusTimeStamps;
    protected $fillable = [
        'short',
        'name',
        'court_identifier'
    ];
    public $timestamps = true;

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function type(): BelongsTo
    {
        return $this->belongsTo(CreditorType::class);
    }
    function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    function defaultCession(): BelongsTo
    {
        return $this->belongsTo(CessionGroup::class);
    }
    function requisites(): BelongsTo
    {
        return $this->belongsTo(Requisites::class);
    }
    function cessionsAsAssignor(): HasMany
    {
        return $this->hasMany(Cession::class, 'assignor_id');
    }
    function cessionsAsAssignee(): HasMany
    {
        return $this->hasMany(Cession::class, 'assignee_id');
    }
    function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    function shortOrName(): string
    {
        return $this->short ? $this->short : $this->name;
    }
}
