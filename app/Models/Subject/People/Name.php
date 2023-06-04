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
        return $this->surname . ' ' . strtoupper(mb_substr($this->name, 0, 1)) . '. ' . strtoupper(mb_substr($this->patronymic, 0, 1)) . '.';
    }
    function getFullGenitive(): string
    {
        $returned = $this->getGenitiveCase($this->surname) . ' ' . $this->getGenitiveCase($this->name);
        if($this->patronymic) $returned .= ' ' . $this->getGenitiveCase($this->patronymic);
        return $returned;
    }

    private function getGenitiveCase(string $word): string {
        $lastChar = mb_substr($word, -1);
        $lastTwoChars = mb_substr($word, -2);

        if ($lastTwoChars === 'ий' || $lastTwoChars === 'ый') {
            return mb_substr($word, 0, -2) . 'ого';
        } elseif ($lastTwoChars === 'ая' || $lastTwoChars === 'яя') {
            return mb_substr($word, 0, -2) . 'ой';
        } elseif ($lastTwoChars === 'ое' || $lastTwoChars === 'ее') {
            return mb_substr($word, 0, -2) . 'ого';
        } elseif ($lastChar === 'ь') {
            return mb_substr($word, 0, -1) . 'я';
        } elseif ($lastChar === 'а') {
            return mb_substr($word, 0, -1) . 'ы';
        } elseif ($lastChar === 'й') {
            return mb_substr($word, 0, -1) . 'я';
        } else {
            return $word . 'а';
        }
    }

}
