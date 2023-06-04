<?php
declare(strict_types=1);


function toConsole(mixed $data): void
{
//    $type = gettype($data);
//    if($type === 'string') return error_log($data);
//    if($type === 'integer' || $type === 'double') return error_log((string)$data);
//    if($type === 'array') {
//        fwrite(STDERR, print_r($data, TRUE));
//        return true;
//    }
//    else return error_log('null');
    error_log(print_r($data, TRUE));
}
