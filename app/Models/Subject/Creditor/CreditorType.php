<?php
declare(strict_types=1);

namespace App\Models\Subject\Creditor;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $creditors;
 */
class CreditorType extends BaseModel
{
    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function creditors(): HasMany
    {
        return $this->hasMany(Creditor::class);
    }
}
