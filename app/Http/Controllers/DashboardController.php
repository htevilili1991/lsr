<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'metrics' => [
                'total_records' => 0,
                'records_this_month' => 0,
                'unique_nationalities' => 0,
            ],
            'monthly_records' => [],
            'recent_records' => [],
            'auth' => [
                'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
            ],
        ]);
    }
}
