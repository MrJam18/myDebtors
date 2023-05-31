<?php
declare(strict_types=1);

function formatRusFloat(string $value) {
    if(str_contains($value, ',')) {
        return str_replace(',', '.', $value);
    }
    return $value;
}
