<?php

use App\Http\Controllers\ExcelController;
use Illuminate\Support\Facades\Route;

Route::get('get-template', [ExcelController::class, 'getTemplate']);
Route::get('get-debtors', [ExcelController::class, 'getDebtors']);
Route::get('get-contracts', [ExcelController::class, 'getContracts']);
Route::get('get-executive-documents', [ExcelController::class, 'getExecutiveDocs']);
Route::get('get-courts', [ExcelController::class, 'getCourts']);
Route::get('get-bailiff-departments', [ExcelController::class, 'getBailiffDepartments']);
