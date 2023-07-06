<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\FilesController;
use Illuminate\Support\Facades\Route;

Route::get('existing-files', [FilesController::class, 'getExistingFiles']);
Route::get('get-file', [FilesController::class, 'getFile']);
Route::post('save-file', [FilesController::class, 'saveFile']);
Route::delete('delete-file/{fileName}', [FilesController::class, 'deleteFile']);
