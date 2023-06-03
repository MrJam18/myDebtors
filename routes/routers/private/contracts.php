<?php
declare(strict_types=1);


use App\Http\Controllers\Contract\ContractCommentController;
use App\Http\Controllers\Contract\ContractsController;
use Illuminate\Support\Facades\Route;

Route::get('limitationsList', [ContractsController::class, 'getLimitations']);
Route::get('status-list', [ContractsController::class, 'getStatusList']);
Route::post('create-one', [ContractsController::class, 'createOne']);
Route::get('get-contract/{id}', [ContractsController::class, 'getOne']);
Route::get('get-statuses', [ContractsController::class, 'getStatusList']);
Route::post('change-contract', [ContractsController::class, 'changeContract']);
Route::post('add-contact-comment', [ContractCommentController::class, 'addComment']);
Route::post('change-contract-comment/{id}', [ContractCommentController::class, 'changeComment']);
Route::get('get-contract-comment/{id}', [ContractCommentController::class, 'getComment']);
Route::get('destroy-contract-comment/{id}', [ContractCommentController::class, 'deleteComment']);

