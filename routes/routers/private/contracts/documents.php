<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\DocumentsController;
use Illuminate\Support\Facades\Route;

Route::post('create-ip-init', [DocumentsController::class, 'createIpInitStatement']);
Route::post('create-court-claim', [DocumentsController::class, 'createCourtClaim']);
Route::get('bailiff-executive-doc-request', [DocumentsController::class, 'getBailiffExecutiveDocRequest']);
Route::get('enforcement-proceeding-familiarization', [DocumentsController::class, 'getEnforcementProceedingFamiliarization']);