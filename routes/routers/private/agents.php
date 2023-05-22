<?php


use App\Http\Controllers\AgentsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [AgentsController::class, 'getList']);
Route::post('create-one', [AgentsController::class, 'addOne']);