<?php

use App\Http\Controllers\Contract\EnforcementProceedingsController;
use Illuminate\Support\Facades\Route;

Route::get('get-list-by-executive-doc/{executiveDocument}', [EnforcementProceedingsController::class, 'getListByExecutiveDoc']);

