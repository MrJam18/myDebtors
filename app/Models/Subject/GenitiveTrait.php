<?php

namespace App\Models\Subject;

trait GenitiveTrait
{
    protected function getGenitiveCase(string $word): string {
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