<?php
declare(strict_types=1);

namespace App\Http\Controllers;


use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends AbstractController
{
    function login(Request $request): JsonResponse | array
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        if ($token = auth()->attempt($credentials)) {
            /**
             * @var $user User
             */
            $user = Auth::user();
            Auth::login($user);
           return [
               'token' => $token,
               'user' => [
                   'id' => $user->id,
                   'groupId' => $user->group->id,
                   'name' => $user->name->getFull(),
                   'email' => $user->email
               ]
           ];
        }
        return response()->json(['error' => 'Unauthorized'])->setStatusCode(401);
    }
    function logout(): JsonResponse
    {
        Auth::logout();
        return response()->json(['message' => 'Successfully logged out'])->setStatusCode(250);
    }

    function getUser(): JsonResponse
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        return response()->json([
            'user' => [
                'email' => $user->email,
                'name' => $user->name->getFull(),
                'id' => $user->id,
                'group' => [
                    'id' => $user->group->id,
                    'name' => $user->group->name
                ]
            ]
        ]);
    }


}
