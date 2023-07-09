<?php
declare(strict_types=1);

use App\Http\Controllers\CessionsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [CessionsController::class, 'getList']);
Route::post('set-one', [CessionsController::class, 'setOne']);
Route::get('get-one/{cessionGroup}', [CessionsController::class, 'getOne']);
Route::post('change-one/{cessionGroup}', [CessionsController::class, 'changeOne']);
Route::delete('{cessionGroup}', [CessionsController::class, 'deleteOne']);
Route::get('search-list', [CessionsController::class, 'getSearchList']);
