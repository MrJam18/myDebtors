<?php
declare(strict_types=1);


use App\Http\Controllers\ListController;
use Illuminate\Support\Facades\Route;

Route::get('all', [ListController::class, 'getList']);
