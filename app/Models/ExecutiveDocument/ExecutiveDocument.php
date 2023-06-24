<?php
declare(strict_types=1);

namespace App\Models\ExecutiveDocument;

use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\MoneySum;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Court\Court;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property float $fee;
 * @property string $number;
 * @property Carbon $issued_date;
 * @property string $resolution_number;
 * @property string $resolution_date;
 * @property Contract $contract;
 * @property ExecutiveDocumentType $type;
 * @property BailiffDepartment $bailiff;
 * @property Court $court;
 * @property MoneySum $moneySum;
 */
class ExecutiveDocument extends BaseModel
{
    protected $fillable = [
        'fee',
        'number',
        'issued_date',
        'resolution_number',
        'resolution_date'
    ];
    public $timestamps = true;

    protected $casts = [
        'issued_date' => 'date:' . ISO_DATE_FORMAT,
        'resolution_date' => 'date:' . ISO_DATE_FORMAT,
    ];

    function type(): BelongsTo
    {
        return $this->belongsTo(ExecutiveDocumentType::class);
    }
    function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
    function bailiff(): BelongsTo
    {
        return $this->belongsTo(BailiffDepartment::class);
    }
    function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }
    function moneySum(): BelongsTo
    {
        return $this->belongsTo(MoneySum::class);
    }
}
