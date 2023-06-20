<?php
declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Auth\User;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\People\Agent;
use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property User $user;
 * @property ExecutiveDocument $executiveDocument;
 * @property Agent $agent;
 *
 */
class IpInitStatement extends BaseModel
{
    protected $fillable = [
        
    ];
    public $timestamps = false;

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    function executiveDocument(): BelongsTo
    {
        return $this->belongsTo(ExecutiveDocument::class);
    }
    function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

}
