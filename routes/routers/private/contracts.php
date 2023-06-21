<?php
declare(strict_types=1);


use App\Http\Controllers\Contracts\ContractCommentsController;
use App\Http\Controllers\Contracts\ContractsController;
use Illuminate\Support\Facades\Route;

Route::get('limitationsList', [ContractsController::class, 'getLimitations']);
Route::get('status-list', [ContractsController::class, 'getStatusList']);
Route::post('create-one', [ContractsController::class, 'createOne']);
Route::get('get-contract/{id}', [ContractsController::class, 'getOne']);
Route::get('get-statuses', [ContractsController::class, 'getStatusList']);
Route::post('change-contract', [ContractsController::class, 'changeContract']);
Route::prefix('{contract}/contract-comments')->group(function () {
    Route::post('add', [ContractCommentsController::class, 'create'])->name('create');
    Route::get('index', [ContractCommentsController::class, 'index'])->name('index');
});
Route::post('/contract-comments/update{id}', [ContractCommentsController::class, 'update'])->name('update');
Route::get('/contract-comments/show/{id}', [ContractCommentsController::class, 'show'])->name('show');



