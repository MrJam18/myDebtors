<?php

declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\CommentFile;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $comments;
 * @property Contract $contract;
 * @property User $user;
 * @property CommentFile $file;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 */
class ContractComment extends BaseModel
{

    protected $fillable = [
        'comments',
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
        return $this->belongsTo(CommentFile::class);
    }
}
