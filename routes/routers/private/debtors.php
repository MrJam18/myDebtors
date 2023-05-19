<?php
declare(strict_types=1);

use App\Http\Controllers\DebtorsController;
use Illuminate\Support\Facades\Route;

Route::post('create-one', [DebtorsController::class, 'createOne']);
Route::get('get-one/{debtor}', [DebtorsController::class, 'getOne']);
Route::get('passport-types', [DebtorsController::class, 'getPassportTypes']);
