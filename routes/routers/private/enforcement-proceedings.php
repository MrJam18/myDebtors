<?php

use App\Http\Controllers\Contract\EnforcementProceedingsController;
use Illuminate\Support\Facades\Route;

Route::get('search-status', [EnforcementProceedingsController::class, 'getStatuses']);
Route::post('create', [EnforcementProceedingsController::class, 'create']);
Route::get('get-all/{id}', [EnforcementProceedingsController::class, 'getAll']);
