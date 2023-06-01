<?php
declare(strict_types=1);

namespace App\Models\Subject\Court;

use App\Models\Address\Address;
use App\Models\Base\BaseModel;
use App\Models\CourtClaim\CourtClaim;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Requisites\BankRequisites;
use App\Models\Requisites\Requisites;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property CourtLevel $level_id;
 * @property CourtType $type_id;
 * @property Collection $executiveDocuments;
 * @property Collection $courtClaims;
 * @property Requisites $requisites;
 */
class Court extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = true;

    function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    function level(): BelongsTo
    {
        return $this->belongsTo(CourtLevel::class);
    }
    function type(): BelongsTo
    {
        return $this->belongsTo(CourtType::class);
    }
    function executiveDocuments(): HasMany
    {
        return $this->hasMany(ExecutiveDocument::class);
    }
    function courtClaims(): HasMany
    {
        return $this->hasMany(CourtClaim::class);
    }
    function requisites(): BelongsTo
    {
        return $this->belongsTo(Requisites::class);
    }

}
