<?php
declare(strict_types=1);

namespace App\Models\ExecutiveDocument;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property Collection $executiveDocuments;
 */
class ExecutiveDocumentType extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function executiveDocuments(): HasMany
    {
        return $this->hasMany(ExecutiveDocument::class);
    }
}
