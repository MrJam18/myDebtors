<?php
declare(strict_types=1);

namespace App\Models\Subject\People;

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
    function initials(): string
    {
        return $this->surname . ' ' . strtoupper(mb_substr($this->surname, 0, 1)) . '. ' . strtoupper(mb_substr($this->patronymic, 0, 1)) . '.';
    }

}
