<?php
declare(strict_types=1);

namespace App\Models\Requisites;

use App\Models\Auth\User;
use App\Models\Base\BaseModel;
use App\Models\Subject\Creditor\Creditor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $checking_account;
 * @property string $correspondent_account;
 * @property BankRequisites $bank;
 * @property Creditor | null $creditor;
 * @property User $user;
 */
class Requisites extends BaseModel
{
    protected $fillable = [
        'correspondent_account',
        '$checking_account'
    ];
    public $timestamps = true;
    protected $table = 'requisites';

    function bank(): BelongsTo
    {
        return $this->belongsTo(BankRequisites::class);
    }
    function creditor(): HasOne
    {
        return $this->hasOne(Creditor::class);
    }
    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
