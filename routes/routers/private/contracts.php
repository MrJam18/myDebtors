<?php
declare(strict_types=1);

use App\Helpers\RoutersHandler;
use App\Http\Controllers\Contract\ContractCommentsController;
use App\Http\Controllers\Contract\ContractsController;
use App\Http\Controllers\Contract\DocumentsController;
use Illuminate\Support\Facades\Route;

$router = new RoutersHandler('private');


Route::prefix('{contract}')->group(function () use ($router) {
    $router->addFolder('contracts');
});
Route::get('limitationsList', [ContractsController::class, 'getLimitations']);
Route::get('status-list', [ContractsController::class, 'getStatusList']);
Route::post('create-one', [ContractsController::class, 'createOne']);
Route::get('get-contract/{id}', [ContractsController::class, 'getOne']);
Route::get('get-statuses', [ContractsController::class, 'getStatusList']);
Route::post('change-contract', [ContractsController::class, 'changeContract']);
Route::post('{contract}/change-creditor', [ContractsController::class, 'changeCreditor']);
Route::prefix('{contract}/contract-comments')->group(function () {
   Route::post('create', [ContractCommentsController::class, 'create'])->name('create');
   Route::get('index', [ContractCommentsController::class, 'index'])->name('index');
});
Route::get('contract-comments/show/{id}', [ContractCommentsController::class, 'show'])->name('show');
Route::post('contract-comments/update/{id}', [ContractCommentsController::class, 'update'])->name('update');
Route::post('contract-comments/delete/{id}', [ContractCommentsController::class, 'delete'])->name('delete');
Route::post('contract-comments/upload/{id}', [ContractCommentsController::class, 'upload'])->name('upload');
