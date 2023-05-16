<?php
declare(strict_types=1);


use App\Http\Controllers\CreditorsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [CreditorsController::class, 'getList']);
Route::get('type-list', [CreditorsController::class, 'getTypeList']);
Route::get('search-bank-requisites', [CreditorsController::class, 'searchBankRequisites']);
Route::post('add-bank-requisites', [CreditorsController::class, 'addBankRequisites']);