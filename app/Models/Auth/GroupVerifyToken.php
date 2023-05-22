<?php
declare(strict_types=1);

namespace App\Models\Auth;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property string $token;
 * @property User $user;
 */
class GroupVerifyToken extends BaseModel
{
    protected $fillable = [
        'token'
    ];
    public $timestamps = false;

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
