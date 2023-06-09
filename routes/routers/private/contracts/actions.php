<?php
declare(strict_types=1);

use App\Http\Controllers\ActionController;
use Illuminate\Support\Facades\Route;

Route::get('list', [ActionController::class, 'getList']);