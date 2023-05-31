<?php
declare(strict_types=1);

namespace App\Models\Subject\Bailiff;

use App\Models\Address\Address;
use App\Models\Base\BaseModel;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property Address $address;
 * @property Collection $executiveDocuments;
 * @property Collection $bailiffs;
 */
class BailiffDepartment extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = true;

    function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    function executiveDocuments(): HasMany
    {
        return $this->hasMany(ExecutiveDocument::class);
    }
    function bailiffs(): HasMany
    {
        return $this->hasMany(Bailiff::class);
    }
}
