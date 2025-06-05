<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use League\Csv\Writer;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Registry/Reports', [
            'workers' => [], // Initial empty state
        ]);
    }

    public function generate(Request $request)
    {
        $selectedColumns = $request->input('selectedColumns', []);
        $filters = $request->input('filters', []);
        $sortBy = $request->input('sortBy', '');
        $sortOrder = $request->input('sortOrder', 'asc');

        $query = Worker::query();

        // Apply filters
        if (!empty($filters['nationality'])) {
            $query->where('nationality', 'like', '%' . $filters['nationality'] . '%');
        }
        if (!empty($filters['sex'])) {
            $query->where('sex', $filters['sex']);
        }
        if (!empty($filters['travel_date_from'])) {
            $query->whereDate('travel_date', '>=', $filters['travel_date_from']);
        }
        if (!empty($filters['travel_date_to'])) {
            $query->whereDate('travel_date', '<=', $filters['travel_date_to']);
        }
        if (!empty($filters['travel_reason'])) {
            $query->where('travel_reason', $filters['travel_reason']);
        }
        if (!empty($filters['direction'])) {
            $query->where('direction', $filters['direction']);
        }

        // Apply sorting
        if (!empty($sortBy)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Select only requested columns
        $workers = $query->select($selectedColumns)->get();

        return Inertia::render('Registry/Reports', [
            'workers' => $workers,
        ]);
    }

    public function export(Request $request, $format)
    {
        $selectedColumns = $request->input('selectedColumns', []);
        $filters = $request->input('filters', []);
        $sortBy = $request->input('sortBy', '');
        $sortOrder = $request->input('sortOrder', 'asc');

        $query = Worker::query();

        // Apply filters
        if (!empty($filters['nationality'])) {
            $query->where('nationality', 'like', '%' . $filters['nationality'] . '%');
        }
        if (!empty($filters['sex'])) {
            $query->where('sex', $filters['sex']);
        }
        if (!empty($filters['travel_date_from'])) {
            $query->whereDate('travel_date', '>=', $filters['travel_date_from']);
        }
        if (!empty($filters['travel_date_to'])) {
            $query->whereDate('travel_date', '<=', $filters['travel_date_to']);
        }
        if (!empty($filters['travel_reason'])) {
            $query->where('travel_reason', $filters['travel_reason']);
        }
        if (!empty($filters['direction'])) {
            $query->where('direction', $filters['direction']);
        }

        // Apply sorting
        if (!empty($sortBy)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $workers = $query->select($selectedColumns)->get()->toArray();

        if ($format === 'csv') {
            $csv = Writer::createFromString();
            $csv->insertOne($selectedColumns);
            $csv->insertAll($workers);
            return response($csv->toString(), 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="report.csv"',
            ]);
        } elseif ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.reports', [
                'columns' => $selectedColumns,
                'workers' => $workers,
            ]);
            return $pdf->download('report.pdf');
        }

        return redirect()->back();
    }
}
