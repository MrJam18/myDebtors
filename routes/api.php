<?php

use App\Helpers\RoutersHandler;
use Illuminate\Support\Facades\Route;

$files = glob(__DIR__ .  DIRECTORY_SEPARATOR . 'routers' . DIRECTORY_SEPARATOR . '*.php');
$router = new RoutersHandler();

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//Route::middleware('auth')->group(function () use (&$router){
//    $router->add('tasks');
//    $router->add('contracts');
//    $router->add('actions');
//    $router->add('debtors');
//    $router->add('list');
//    $router->add('creditors');
//});

$router->addFolder('private', 'auth');
$router->add('users');
