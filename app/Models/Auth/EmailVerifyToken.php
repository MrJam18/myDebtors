<?php
declare(strict_types=1);

namespace App\Models\Auth;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $verified_at;
 * @property string $token;
 * @property User $user;
 */
class EmailVerifyToken extends BaseModel
{
    protected $fillable = [
        'verified_at',
        'token'
    ];
    public $timestamps = false;

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
