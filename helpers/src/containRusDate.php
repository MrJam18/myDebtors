<?php
function containRusDate(string $value): bool {
    return str_contains($value, '.');
}
