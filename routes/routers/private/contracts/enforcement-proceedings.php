<?php

use App\Http\Controllers\Contract\EnforcementProceedingsController;
use Illuminate\Support\Facades\Route;

Route::get('get-last-id-and-name', [EnforcementProceedingsController::class, 'getLastIdAndName']);