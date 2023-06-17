<?php


use App\Http\Controllers\Contract\CourtClaimsController;
use Illuminate\Support\Facades\Route;

Route::get('get-one/{claim}', [CourtClaimsController::class, 'getOne']);
Route::post('change-or-create-one', [CourtClaimsController::class, 'changeOrCreateOne'] );
