<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Total records
            $totalRecords = Registry::count();

            // Records this month
            $recordsThisMonth = Registry::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();

            // Unique nationalities
            $uniqueNationalities = Registry::distinct('nationality')->count('nationality');

            // Monthly record counts for the last 12 months
            $monthlyRecords = Registry::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as count')
            )
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->month => $item->count];
                })
                ->toArray();

            // Fill missing months with zero counts
            $months = [];
            for ($i = 11; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i)->format('Y-m');
                $months[$month] = $monthlyRecords[$month] ?? 0;
            }

            // Recent 5 records
            $recentRecords = Registry::select([
                'id', 'surname', 'given_name', 'nationality', 'travel_date', 'created_at'
            ])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            Log::info('Dashboard data fetched', [
                'total_records' => $totalRecords,
                'records_this_month' => $recordsThisMonth,
                'unique_nationalities' => $uniqueNationalities,
                'monthly_records' => $months,
                'recent_records_count' => $recentRecords->count(),
            ]);

            return Inertia::render('dashboard', [
                'metrics' => [
                    'total_records' => $totalRecords,
                    'records_this_month' => $recordsThisMonth,
                    'unique_nationalities' => $uniqueNationalities,
                ],
                'monthly_records' => $months,
                'recent_records' => $recentRecords,
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching dashboard data: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return Inertia::render('Error', [
                'message' => 'Unable to load dashboard data.',
            ]);
        }
    }
}
