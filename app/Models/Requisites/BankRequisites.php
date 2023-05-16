<?php
declare(strict_types=1);

namespace App\Models\Requisites;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Ramsey\Collection\Collection;

/**
 * @property int $id;
 * @property string $name;
 * @property string $BIK;
 * @property Collection $requisites;
 */
class BankRequisites extends BaseModel
{
    protected $fillable = [
        'name',
        'BIK'
    ];
    public $timestamps = false;
    protected $table = 'bank_requisites';

    function requisites(): HasMany
    {
        return $this->hasMany(Requisites::class);
    }
}
