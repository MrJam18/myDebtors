<?php

use App\Http\Controllers\Contract\EnforcementProceedingsController;
use Illuminate\Support\Facades\Route;

Route::get('get-list-by-executive-doc/{executiveDocument}', [EnforcementProceedingsController::class, 'getListByExecutiveDoc']);
Route::post('set-all-by-executive-doc/{executiveDocument}', [EnforcementProceedingsController::class, 'setAllByExecutiveDoc']);
Route::get('search-list-by-contract', [EnforcementProceedingsController::class, 'getSearchListByContract']);
Route::get('get-list-for-chooser', [EnforcementProceedingsController::class, 'getListForChooser']);
Route::get('get-last-and-default-agent/{executiveDocument}', [EnforcementProceedingsController::class, 'getLastAndDefaultAgent']);
