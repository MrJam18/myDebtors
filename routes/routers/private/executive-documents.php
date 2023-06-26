<?php

use App\Http\Controllers\Contract\ExecutiveDocumentsController;
use Illuminate\Support\Facades\Route;

Route::post('create-from-excel', [ExecutiveDocumentsController::class, 'createFromExcel']);
