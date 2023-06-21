<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\FilesController;
use Illuminate\Support\Facades\Route;

Route::get('existing-files', [FilesController::class, 'getExistingFiles']);
