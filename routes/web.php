<?php

use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/group/verify/{id}/{token}', [AuthController::class, 'verifyGroup'])->name('groupVerify');
Route::get('/email/verify/{id}/{token}', [AuthController::class, 'verifyEmail'])->middleware(['signed'])->name('verification.verify');
Route::view('/{path}', 'main')
    ->where('path', '^(?!api/).*')
    ->name('react');

Route::post('api/search', [SearchController::class, 'index']);