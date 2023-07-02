<?php
declare(strict_types=1);
use App\Http\Controllers\Contracts\ContractsController;
use App\Http\Controllers\Contracts\CourtController;
use Illuminate\Support\Facades\Route;


Route::get('getLevels', [CourtController::class, 'getLevels']);
Route::get('getTypes',[CourtController::class,'getTypes']);
Route::post('create', [CourtController::class, 'create']);
Route::get('search-list', [CourtController::class, 'findByName']);
Route::get('search-bank-requisites', [CourtController::class, 'searchBankRequisites']);
Route::post('create-from-excel', [CourtController::class, 'createFromExcel']);
