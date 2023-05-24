<?php
declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class ShowableException extends Exception
{

    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->message], 551);
    }
}