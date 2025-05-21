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

    // Registry resource routes
    Route::resource('registry', RegistryController::class);

    // CSV upload routes
    Route::get('registry/upload', [RegistryController::class, 'upload'])->name('registry.upload');
    Route::post('registry/upload', [RegistryController::class, 'storeCsv'])->name('registry.storeCsv');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
