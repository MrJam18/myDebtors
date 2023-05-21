<?php
declare(strict_types=1);

namespace App\Http\Controllers\AbstractControllers;

use Exception;
use Illuminate\Routing\Controller;

class AbstractController extends Controller
{
    function log(string $message): void
    {
        error_log($message);
    }

    /**
     * @throws Exception
     */
    function getFormData(?string $key = null): array | string | null
    {
        $data = request()->input('formData');
        if($data) {
            if($key) return $data[$key];
            else return $data;
        }
        throw new Exception('cant get form data');
    }
    function exceptionIfNull(mixed &$data, $message = 'data is null'): void
    {
        if(!$data) throw new Exception($message);
    }

}
