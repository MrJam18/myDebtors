<?php
declare(strict_types=1);

namespace App\Models\Cession;

use App\Models\Base\BaseModel;
use App\Models\Subject\Creditor\Creditor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property Carbon $transfer_date;
 * @property float $sum;
 * @property string $number;
 * @property string $text;
 * @property boolean $use_default_text;
 * @property CessionGroup $cessionGroup;
 * @property Creditor $assignor;
 * @property Creditor $assignee;
 * @property Collection $enclosures;
 */
class Cession extends BaseModel
{
    protected $fillable = [
        'transfer_date',
        'sum',
        'number',
        'text',
        'use_default_text'
    ];
    public $timestamps = true;

    protected $casts = [
        'transfer_date' => 'date'
    ];
    function cessionGroup(): BelongsTo
    {
        return $this->belongsTo(CessionGroup::class);
    }
    function assignor(): BelongsTo
    {
        return $this->belongsTo(Creditor::class, 'assignor_id');
    }
    function assignee(): BelongsTo
    {
        return $this->belongsTo(Creditor::class, 'assignee_id');
    }
    function enclosures(): HasMany
    {
        return $this->hasMany(CessionEnclosure::class, 'cession_id');
    }

}
