<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\ContractCommentsController;
use Illuminate\Support\Facades\Route;

Route::post('update-one/{comment}', [ContractCommentsController::class, 'updateOne']);
Route::get('get-file/{comment}', [ContractCommentsController::class, 'getFile']);
Route::delete('delete-one/{comment}', [ContractCommentsController::class, 'deleteOne']);
