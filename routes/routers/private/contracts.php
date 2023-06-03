<?php
declare(strict_types=1);


use App\Http\Controllers\Contracts\ContractCommentController;
use App\Http\Controllers\Contracts\ContractsController;
use Illuminate\Support\Facades\Route;

Route::get('limitationsList', [ContractsController::class, 'getLimitations']);
Route::get('status-list', [ContractsController::class, 'getStatusList']);
Route::post('create-one', [ContractsController::class, 'createOne']);
Route::get('get-contract/{id}', [ContractsController::class, 'getOne']);
Route::get('get-statuses', [ContractsController::class, 'getStatusList']);
Route::post('change-contract', [ContractsController::class, 'changeContract']);

