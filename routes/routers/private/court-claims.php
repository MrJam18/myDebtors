<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\CourtClaimsController;
use Illuminate\Support\Facades\Route;

Route::get('get-statuses', [CourtClaimsController::class, 'getStatuses']);
Route::get('get-types', [CourtClaimsController::class, 'getTypes']);