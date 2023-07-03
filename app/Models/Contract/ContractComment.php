<?php

declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property string $text;
 * @property Contract $contract;
 * @property User $user;
 * @property string $file_name;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 */
class ContractComment extends BaseModel
{

    protected $fillable = [
        'text',
        'file_name'
    ];

    public $timestamps = true;


    function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
