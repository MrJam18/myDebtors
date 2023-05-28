<?php
declare(strict_types=1);
function getRubles(float|int $value): float
{
    return round($value, 2);
}
