<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class Authenticate extends Middleware
{

    function handle($request, Closure $next, ...$guards): Closure | JsonResponse | Response
    {
        if(Auth::guest()) {
            return response()->json(['error' => 'Unauthorized access'], 401);
        }
        else return $next($request);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('login');
    }
}
