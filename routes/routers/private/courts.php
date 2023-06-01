<?php
declare(strict_types=1);
use App\Http\Controllers\Contract\ContractsController;
use App\Http\Controllers\Contract\CourtController;
use Illuminate\Support\Facades\Route;


Route::get('getLevels', [CourtController::class, 'getLevels']);
Route::get('getTypes',[CourtController::class,'getTypes']);
Route::post('create', [CourtController::class, 'create']);
Route::get('findByName', [CourtController::class, 'findByName']);
Route::get('search-bank-requisites', [CourtController::class, 'searchBankRequisites']);
