<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;

class TaskController extends AbstractController
{
    function getList(): array
    {
        return [
            'list' => [],
            'count' => 0
        ];
    }
}
