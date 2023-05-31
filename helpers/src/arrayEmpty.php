<?php
declare(strict_types=1);

function arrayEmpty(array $array): bool {
    if(count($array) === 0) return true;
    return false;
}
