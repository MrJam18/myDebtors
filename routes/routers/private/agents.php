<?php


use App\Http\Controllers\AgentsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [AgentsController::class, 'getList']);
Route::post('create-one', [AgentsController::class, 'addOne']);
Route::get('get-one/{agent}', [AgentsController::class, 'getOne']);
Route::post('change-one/', [AgentsController::class, 'update']);
Route::delete('delete-one/{agent}', [AgentsController::class, 'delete']);
