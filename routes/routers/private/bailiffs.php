<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\BailiffsController;
use Illuminate\Support\Facades\Route;

Route::post('create', [BailiffsController::class, 'create']);
Route::get('search', [BailiffsController::class, 'findByName']);
Route::get('get-positions', [BailiffsController::class, 'getBailiffPositions']);
