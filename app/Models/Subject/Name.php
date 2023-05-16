<?php
declare(strict_types=1);

namespace App\Models\Subject;

use App\Models\Base\BaseModel;
use Carbon\Carbon;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $name;
 * @property string $surname;
 * @property ?string $patronymic;
 */
class Name extends BaseModel
{
    protected $fillable = [
        'name',
        'surname',
        'patronymic'
    ];
    public $timestamps = false;

    function getFull(): string
    {
        return $this->surname . ' ' . $this->name . ' ' . $this->patronymic;
    }
}
