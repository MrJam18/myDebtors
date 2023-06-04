<?php

declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\File;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property string $comment;
 * @property Contract $contract;
 * @property User $user;
 * @property File $file;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 */
class ContractComment extends BaseModel
{

    protected $fillable = [
        'comment',
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

    function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }
}
