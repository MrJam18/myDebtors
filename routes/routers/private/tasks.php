<?php
declare(strict_types=1);

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('getList', [TaskController::class, 'getList']);
