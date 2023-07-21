<?php
function getRusFloat(string $value): string {
    if(str_contains($value, ',')) {
        $value = str_replace(',', '.', $value);
    }
    return $value;
}
