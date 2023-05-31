<?php
declare(strict_types=1);

namespace App\Http\Controllers;


use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\SearchRequest;
use App\Mail\GroupVerification;
use App\Mail\MailVerification;
use App\Models\Auth\EmailVerifyToken;
use App\Models\Auth\Group;
use App\Models\Auth\GroupVerifyToken;
use App\Models\Auth\User;
use App\Models\Auth\UserRole;
use App\Models\Subject\Name;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

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
            if($user->emailVerifyToken || $user->groupVerifyToken) {
                return response()->json(['error' => 'Электронная почта или группа не авторизованы'], 402);
            }
            Auth::login($user);
            $user->is_online = true;
            $user->save();
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

    function getUser(): ?JsonResponse
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        if($user) {
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
        return null;
    }

    function registration(Request $request): void
    {
        $data = $request->all();
        DB::transaction(function () use(&$data) {
            $formData = $data['formData'];
            $found = User::query()->where('email', $formData['email'])->first(['id']);
            if($found) throw new ShowableException('Пользователь с таким email уже существует.');
            $user = new User();
            $user->email = $formData['email'];
            $user->password = $formData['password'];
            $user->phone = $formData['phone'];
            $name = new Name();
            $name->name = $formData['name'];
            $name->surname = $formData['surname'];
            $name->patronymic = $formData['patronymic'];
            $name->save();
            $user->name()->associate($name);
            if(!isset($data['group_id'])) {
                $found = Group::query()->where('name', $formData['groupName'])->first();
                if($found) throw new ShowableException('Группа с таким названием уже существует');
                $group = new Group();
                $group->name = $formData['groupName'];
                $group->save();
                $user->group()->associate($group);
                $user->role()->associate(UserRole::find(2));
                $user->save();
            }
            else {
                $group = Group::find($data['group_id']);
                $this->exceptionIfNull($group);
                $user->group()->associate($group);
                $groupVerifyToken = new GroupVerifyToken();
                $groupVerifyToken->token = Str::random(60);
                $user->role()->associate(UserRole::find(3));
                $user->save();
                $groupVerifyToken->user()->associate($user);
                $groupVerifyToken->save();
            }
            $verifyToken = new EmailVerifyToken();
            $verifyToken->token = Str::random(60);
            $verifyToken->user()->associate($user);
            $verifyToken->save();
            $url = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
                [
                    'id' => $user->id,
                    'token' => $verifyToken->token,
                ]
            );
            $email = new MailVerification($user, $url);
            Mail::queue($email);
        });
    }

    function verifyEmail(Request $request): View
    {
        $user = User::find((int)$request->route('id'));
        if(!$user) {
            $data = [
                'redirect' => false,
                'message' => 'Не могу найти аккаунт по полученному идентификатору'
            ];
        }
        elseif(!$user->emailVerifyToken){
            $data = [
                'redirect'=> true,
                'message'=> 'Аккаунт уже был авторизован. Через 10 секунд вы будете перенаправлены на страницу входа.'
            ];
        }
        elseif($user->emailVerifyToken->token === $request->route('token')) {
            if($user->groupVerifyToken) {
                $data = [
                    'message' => 'Аккаунт успешно авторизован. Ожидайте подтверждения вступления в группу от владельца группы. Оно направлено на электронную почту.',
                    'redirect' => false
                ];
                $url = URL::route('groupVerify', [
                    'id' => $user->id,
                    'token' => $user->groupVerifyToken->token
                ]);
                $email = new GroupVerification($user, $url);
                Mail::queue($email);
            }
            else $data =  [
                'message' => 'Аккаунт успешно авторизован. Через 10 секунд вы будете перенаправлены на страницу входа.',
                'redirect' => true
            ];
            $user->emailVerifyToken->delete();
        }
        else {
            $data = [
                'redirect' => false,
                'message' => 'Полученные данные не совпадают.'
            ];
        }
        return \view('mailVerification', $data);
    }

    function verifyGroup(Request $request): View
    {
        $user = User::find((int)$request->route('id'));
        if(!$user) {
            $message = 'Не могу найти аккаунт по полученному идентификатору';
        }
        elseif(!$user->groupVerifyToken){
            $message = 'Аккаунт уже был авторизован.';
        }
        elseif($user->groupVerifyToken->token === $request->route('token')) {
            $user->groupVerifyToken->delete();
            $message = 'Группа аккаунта успешно авторизована.';
        }
        else {
            $message = 'Полученные данные не совпадают.';
        }
        return \view('groupVerification', [
            'message' => $message
        ]);
    }

    function getGroupSearchList(SearchRequest $request): Collection
    {
        return Group::query()->search(['name' => $request->validated()])->limit(5)->get();
    }


}
