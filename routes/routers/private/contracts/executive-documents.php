<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\ExecutiveDocumentsController;
use Illuminate\Support\Facades\Route;

Route::post('set-one', [ExecutiveDocumentsController::class, 'set']);
Route::get('get-one', [ExecutiveDocumentsController::class, 'getOne']);
Route::get('get-list-for-chooser', [ExecutiveDocumentsController::class, 'getListForChooser']);

