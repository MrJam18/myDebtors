<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\PaymentsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [PaymentsController::class, 'getList']);
Route::post('add-one', [PaymentsController::class, 'addOne']);
Route::post('change-one/{paymentId}', [PaymentsController::class, 'changeOne']);
Route::delete('delete-one/{payment}', [PaymentsController::class, 'deleteOne']);
