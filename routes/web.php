<?php

use App\Http\Controllers\RegistryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('registry', RegistryController::class);
    Route::get('registry/upload', [RegistryController::class, 'csvUpload'])->name('registry.csv.upload');
    Route::post('registry/upload', [RegistryController::class, 'storeCsv'])->name('registry.csv.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
