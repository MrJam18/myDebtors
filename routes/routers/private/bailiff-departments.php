<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\BailiffDepartmentsController;
use Illuminate\Support\Facades\Route;

Route::post('create-from-excel', [BailiffDepartmentsController::class, 'createFromExcel']);
