<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\BailiffDepartmentsController;
use Illuminate\Support\Facades\Route;

Route::post('createOne', [BailiffDepartmentsController::class, 'create']);
Route::get('search', [BailiffDepartmentsController::class, 'findByName']);

