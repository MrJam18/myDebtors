<?php
declare(strict_types=1);


function toConsole(array | string | int | float | null $data): bool
{
    $type = gettype($data);
    if($type === 'string') return error_log($data);
    if($type === 'integer' || $type === 'double') return error_log((string)$data);
    if($type === 'array') {
        toConsole(print_r($data));
        return true;
//        foreach ($data as $key => $value)
//        {
//            $output .= "$key =>";
//            if(is_array($value))
////            $value\n";
//        }
//        return error_log($output);
    }
    else return error_log('null');
}
