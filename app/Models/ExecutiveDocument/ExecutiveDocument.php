<?php
declare(strict_types=1);

namespace App\Models\ExecutiveDocument;

use App\Models\Base\BaseModel;
use App\Models\Contract\Contract;
use App\Models\Contract\IpInitStatement;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\MoneySum;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Court\Court;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property float $fee;
 * @property string $number;
 * @property Carbon $issued_date;
 * @property string $resolution_number;
 * @property Carbon $resolution_date;
 * @property Contract $contract;
 * @property int $type_id;
 * @property int $bailiff_department_id
 * @property int $court_id;
 * @property ExecutiveDocumentType $type;
 * @property BailiffDepartment $bailiffDepartment;
 * @property Court $court;
 * @property MoneySum $moneySum;
 * @property Collection $ipInitStatements;
 * @property Collection $enforcementProceedings;
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
    function bailiffDepartment(): BelongsTo
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
    function ipInitStatements(): HasMany
    {
        return $this->hasMany(IpInitStatement::class);
    }
    function enforcementProceedings(): HasMany
    {
        return $this->hasMany(EnforcementProceeding::class);
    }
    function getName(): string
    {
        return "{$this->type->name} № {$this->number} от {$this->issued_date->format(RUS_DATE_FORMAT)} г.";
    }
}
