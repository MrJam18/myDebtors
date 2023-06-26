<?php


use App\Http\Controllers\Contract\CourtClaimsController;
use Illuminate\Support\Facades\Route;

Route::get('get-list-by-contract', [CourtClaimsController::class, 'getListByContract']);
Route::post('update-list-by-contract', [CourtClaimsController::class, 'updateListByContract']);
Route::delete('delete-all-by-contract', [CourtClaimsController::class, 'deleteAllByContract']);
Route::get('get-list-for-chooser', [CourtClaimsController::class, 'getListForChooser']);
