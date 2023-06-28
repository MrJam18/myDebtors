<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\ExecutiveDocumentsController;
use Illuminate\Support\Facades\Route;

Route::post('set', [ExecutiveDocumentsController::class, 'set']);
Route::get('get-all', [ExecutiveDocumentsController::class, 'getAll']);

