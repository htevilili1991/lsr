<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Test database connection
            DB::connection()->getPdo();

            // Total records
            $totalRecords = Registry::count();

            // Records this month (based on created_at)
            $recordsThisMonth = Registry::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();

            // Unique nationalities
            $uniqueNationalities = Registry::distinct('nationality')->count('nationality');

            // Monthly records by travel_date (last 12 months)
            $monthlyRecordsTravel = Registry::select(
                DB::raw("TO_CHAR(TO_DATE(travel_date, 'DD/MM/YYYY'), 'YYYY-MM') as month"),
                DB::raw('COUNT(*) as count')
            )
                ->whereNotNull('travel_date')
                ->whereRaw("TO_DATE(travel_date, 'DD/MM/YYYY') >= ?", [Carbon::now()->subMonths(12)->toDateString()])
                ->groupBy(DB::raw("TO_CHAR(TO_DATE(travel_date, 'DD/MM/YYYY'), 'YYYY-MM')"))
                ->orderByRaw("TO_CHAR(TO_DATE(travel_date, 'DD/MM/YYYY'), 'YYYY-MM') ASC")
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->month => (int) $item->count];
                })
                ->toArray();

            // Fill missing months with zero counts
            $monthsTravel = [];
            for ($i = 11; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i)->format('Y-m');
                $monthsTravel[$month] = $monthlyRecordsTravel[$month] ?? 0;
            }

            // Records by travel_reason
            $travelReasonRecords = Registry::select(
                'travel_reason',
                DB::raw('COUNT(*) as count')
            )
                ->whereNotNull('travel_reason')
                ->groupBy('travel_reason')
                ->orderByDesc('count')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->travel_reason ?? 'Unknown',
                        'y' => (int) $item->count,
                    ];
                })
                ->toArray();

            // Records by sex
            $sexRecords = Registry::select(
                'sex',
                DB::raw('COUNT(*) as count')
            )
                ->whereNotNull('sex')
                ->groupBy('sex')
                ->orderByDesc('count')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->sex ?? 'Unknown',
                        'y' => (int) $item->count,
                    ];
                })
                ->toArray();

            // Recent 5 records
            $recentRecords = Registry::select([
                'id', 'surname', 'given_name', 'nationality', 'travel_date', 'created_at'
            ])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'surname' => $record->surname ?? 'N/A',
                        'given_name' => $record->given_name ?? 'N/A',
                        'nationality' => $record->nationality ?? 'N/A',
                        'travel_date' => $record->travel_date ? Carbon::createFromFormat('d/m/Y', $record->travel_date)->toDateString() : null,
                        'created_at' => Carbon::parse($record->created_at)->toDateTimeString(),
                    ];
                })
                ->toArray();

            Log::info('Dashboard data fetched', [
                'total_records' => $totalRecords,
                'records_this_month' => $recordsThisMonth,
                'unique_nationalities' => $uniqueNationalities,
                'monthly_records_travel' => $monthsTravel,
                'travel_reason_records' => $travelReasonRecords,
                'sex_records' => $sexRecords,
                'recent_records_count' => count($recentRecords),
            ]);

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'total_records' => (int) $totalRecords,
                    'records_this_month' => (int) $recordsThisMonth,
                    'unique_nationalities' => (int) $uniqueNationalities,
                ],
                'monthly_records_travel' => $monthsTravel,
                'travel_reason_records' => $travelReasonRecords,
                'sex_records' => $sexRecords,
                'recent_records' => $recentRecords,
                'auth' => [
                    'user' => auth()->check() ? auth()->user()->only(['name', 'email']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching dashboard data: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return Inertia::render('Dashboard', [
                'metrics' => [
                    'total_records' => 0,
                    'records_this_month' => 0,
                    'unique_nationalities' => 0,
                ],
                'monthly_records_travel' => [],
                'travel_reason_records' => [],
                'sex_records' => [],
                'recent_records' => [],
                'error' => 'Unable to load dashboard data: ' . $e->getMessage(),
                'auth' => [
                    'user' => auth()->check() ? auth()->user()->only(['name', 'email']) : null,
                ],
            ]);
        }
    }
}
