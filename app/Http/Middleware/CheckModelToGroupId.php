<?php

namespace App\Http\Middleware;

use App\Exceptions\ShowableException;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModelToGroupId
{

    public function handle(Request $request, Closure $next): Response
    {
        foreach ($request->route()->parameters() as $parameter) {
            if($parameter instanceof Model && isset($parameter->user) && $parameter->user->group_id !== getGroupId()) {
                throw new ShowableException('У вас нет прав на изменение или получение данной сущности.');
                }
        }
        return $next($request);
    }
}
