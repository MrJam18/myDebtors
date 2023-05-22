<?php
declare(strict_types=1);

use App\Http\Controllers\DebtorsController;
use Illuminate\Support\Facades\Route;

Route::post('create-one', [DebtorsController::class, 'createOne']);
