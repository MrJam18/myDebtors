<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use App\Services\AbstractServices\BaseService;
use Symfony\Component\HttpFoundation\StreamedResponse;

abstract class ExcelBaseService extends BaseService
{

    function getFileResponse(string $name): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Transfer-Encoding' => 'binary',
        ];

    }
}