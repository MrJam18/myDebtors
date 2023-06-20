<?php

use App\Http\Controllers\ExcelController;
use Illuminate\Support\Facades\Route;

Route::get('get-template', [ExcelController::class, 'getTemplate']);
