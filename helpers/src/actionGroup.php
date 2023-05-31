<?php
declare(strict_types=1);

use Illuminate\Support\Facades\Route;

function actionGroup(string $Controller, string $model) {
    Route::prefix('actions')->name("actions/")->group(function() use ($Controller, $model) {
        Route::delete('delete/{' . $model . '}', [$Controller, 'destroy'])->name('delete');
        Route::post('create', [$Controller, 'create'])->name('create');
        Route::post('change/{' . $model . '}', [$Controller, 'edit'])->name('change');
    });
}
