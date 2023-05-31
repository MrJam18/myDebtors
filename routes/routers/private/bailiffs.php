<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\BailiffController;
use Illuminate\Support\Facades\Route;

Route::post('createOne', [BailiffController::class, 'create']);
Route::get('search', [BailiffController::class, 'findByName']);
