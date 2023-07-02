<?php

use App\Http\Controllers\Contract\DocumentsController;
use Illuminate\Support\Facades\Route;

Route::get('get-court-claim-doc/{claim}', [DocumentsController::class, 'getCourtClaimDoc']);
Route::get('court-request-for-executive-doc', [DocumentsController::class, 'getCourtRequestForExecutiveDoc']);
Route::get('resolution-request', [DocumentsController::class, 'getResolutionRequest']);
