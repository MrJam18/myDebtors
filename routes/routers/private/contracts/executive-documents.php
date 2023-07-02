<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\ExecutiveDocumentsController;
use Illuminate\Support\Facades\Route;

Route::post('set-one', [ExecutiveDocumentsController::class, 'set']);
Route::get('get-list-for-chooser', [ExecutiveDocumentsController::class, 'getListForChooser']);
Route::get('get-all', [ExecutiveDocumentsController::class, 'getAll']);

