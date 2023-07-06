<?php
declare(strict_types=1);


use App\Http\Controllers\Contract\ContractCommentsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [ContractCommentsController::class, 'getList']);
Route::post('create-one', [ContractCommentsController::class, 'createOne']);