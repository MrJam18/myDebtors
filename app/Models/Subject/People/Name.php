<?php
declare(strict_types=1);

namespace App\Models\Subject\People;

use App\Models\Base\BaseModel;
use App\Models\Subject\GenitiveTrait;
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
    use GenitiveTrait;

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
        return $this->surname . ' ' . strtoupper(mb_substr($this->name, 0, 1)) . '. ' . strtoupper(mb_substr($this->patronymic, 0, 1)) . '.';
    }
    function getFullGenitive(): string
    {
        $returned = $this->getGenitiveCase($this->surname) . ' ' . $this->getGenitiveCase($this->name);
        if($this->patronymic) $returned .= ' ' . $this->getGenitiveCase($this->patronymic);
        return $returned;
    }

}
