<?php
declare(strict_types=1);

namespace App\Models\Contract;

use App\Enums\Database\ContractTypeEnum;
use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id;
 * @property string $name;
 * @property Collection $contracts;
 */
class ContractType extends BaseModel
{

    protected $fillable = [
        'name'
    ];
    public $timestamps = false;

    function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
    function dativeIncline(): string
    {
        return $this->id === ContractTypeEnum::Loan->value ? 'договору займа' : "кредитному договору";
    }

}
