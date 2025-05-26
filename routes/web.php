<?php

use App\Http\Controllers\RegistryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GroupController;

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

    Route::get('/groups', [GroupController::class, 'index'])
        ->middleware('permission:view groups')
        ->name('groups.index');
    Route::post('/groups', [GroupController::class, 'store'])
        ->middleware('permission:create groups')
        ->name('groups.store');
    Route::put('/groups/{role}', [GroupController::class, 'update'])
        ->middleware('permission:edit groups')
        ->name('groups.update');
    Route::delete('/groups/{role}', [GroupController::class, 'destroy'])
        ->middleware('permission:delete groups')
        ->name('groups.destroy');
    Route::post('/groups/{role}/permissions', [GroupController::class, 'assignPermissions'])
        ->middleware('permission:assign permissions')
        ->name('groups.permissions');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
