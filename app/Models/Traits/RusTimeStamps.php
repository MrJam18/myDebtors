<?php

namespace App\Models\Traits;

use DateTime;

trait RusTimeStamps
{
    public function getCreatedAtAttribute(?string $date): ?string
    {
        if($date) return $this->getRusDateTime($date);
        return null;

    }
    public function getUpdatedAtAttribute(?string $date): ?string
    {
        if($date) return $this->getRusDateTime($date);
        return null;
    }
    private function getRusDateTime(string $date): string
    {
        $dateTime = DateTime::createFromFormat('Y-m-d H:i:s', $date);
        if($dateTime) return $dateTime->format('d.m.Y H:i:s');
        else return $date;
    }

}
