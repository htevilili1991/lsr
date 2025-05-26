<?php

use App\Http\Controllers\RegistryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Explicit upload routes
    Route::get('registry/upload', [RegistryController::class, 'upload'])->name('registry.upload');
    Route::post('registry/upload', [RegistryController::class, 'storeCsv'])->name('registry.storeCsv');

    // Resource routes with constraints
    Route::resource('registry', RegistryController::class)->where(['registry' => '[0-9]+']);
    Route::get('/registry/export', [RegistryController::class, 'export'])->name('registry.export');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
