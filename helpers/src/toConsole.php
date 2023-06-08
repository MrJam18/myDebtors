<?php
declare(strict_types=1);


function toConsole(mixed $data): void
{
    $type = gettype($data);
    if($type === 'string') error_log($data);
    elseif($type === 'integer' || $type === 'double') error_log((string)$data);
    elseif($type === "NULL") error_log('null');
    else error_log(print_r($data, TRUE));
}
