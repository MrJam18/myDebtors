<?php
declare(strict_types=1);

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::get('get', [AuthController::class, 'getUser'])->middleware('auth');
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth');
