<?php

declare(strict_types=1);

namespace App\Models\Contract;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractCommentary extends Model
{
    use HasFactory;

    protected $fillable = [
        'commentary',
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
