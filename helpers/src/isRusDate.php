<?php

function isRusDate(string $value): bool
{
    return preg_match("/^\d{2}\.\d{2}\.\d{2,4}$/", $value);
}
