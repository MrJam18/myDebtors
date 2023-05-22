<?php
declare(strict_types=1);


function toConsole(array | string | int | null $data): bool
{
    $type = gettype($data);
    if($type === 'string') return error_log($data);
    if($type === 'integer') return error_log((string)$data);
    if($type === 'array') {
        $output = '';
        foreach ($data as $key => $value)
        {
            $output .= "$key => $value\n";
        }
        return error_log($output);
    }
    else return error_log('null');
}
