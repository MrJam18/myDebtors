<?php
declare(strict_types=1);

namespace App\Models\Action;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $result;
 * @property ActionType $type;
 * @property ActionObject $object;
 * @property Contract $contract;
 * @property User $user;
 */
class Action extends BaseModel
{
    protected $fillable = [
        'result'
    ];
    public $timestamps = true;

    function type(): BelongsTo
    {
        return $this->belongsTo(ActionType::class);
    }
    function object(): BelongsTo
    {
        return $this->belongsTo(ActionObject::class);
    }
    function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
