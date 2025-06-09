<?php

use App\Http\Controllers\RegistryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Registry routes
    Route::prefix('registry')->group(function () {
        // Explicit upload routes
        Route::get('upload', [RegistryController::class, 'upload'])->name('registry.upload');
        Route::post('upload', [RegistryController::class, 'storeCsv'])->name('registry.storeCsv');

        // Reports routes
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::post('reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
        Route::post('reports/export/{format}', [ReportController::class, 'export'])->name('reports.export');

        // Resource routes with constraints
        Route::resource('/', RegistryController::class)
            ->where(['registry' => '[0-9]+'])
            ->names('registry')
            ->parameters(['' => 'registry']);

        // Search and export
        Route::get('search', [RegistryController::class, 'search'])->name('registry.search');
        Route::get('export', [RegistryController::class, 'export'])->name('registry.export');
    });

    Route::get('/audits', [AuditController::class, 'index'])->name('audits.index');
    Route::delete('/audits', [AuditController::class, 'clear'])->name('audits.clear');

    // Include settings routes
    require __DIR__.'/settings.php';
});

require __DIR__.'/auth.php';
