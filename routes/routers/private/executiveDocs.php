<?php
declare(strict_types=1);

use App\Http\Controllers\Contract\ExecutiveDocsController;
use Illuminate\Support\Facades\Route;

Route::post('setExecutiveDoc', [ExecutiveDocsController::class, 'set']);
