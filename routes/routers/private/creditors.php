<?php
declare(strict_types=1);


use App\Http\Controllers\CreditorsController;
use Illuminate\Support\Facades\Route;

Route::get('list', [CreditorsController::class, 'getList']);
Route::get('type-list', [CreditorsController::class, 'getTypeList']);
Route::get('search-bank-requisites', [CreditorsController::class, 'searchBankRequisites']);
Route::post('add-bank-requisites', [CreditorsController::class, 'addBankRequisites']);
Route::post('add-one', [CreditorsController::class, 'addOne']);
Route::get('get-one', [CreditorsController::class, 'getOne']);
Route::post('change-one', [CreditorsController::class, 'changeOne']);
Route::delete('delete-one', [CreditorsController::class, 'deleteOne']);
Route::get('search-list-with-cession', [CreditorsController::class, 'getSearchListWithCession']);
Route::get('search-list', [CreditorsController::class, 'getSearchList']);