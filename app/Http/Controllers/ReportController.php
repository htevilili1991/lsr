<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Registry;
use App\Models\ReportConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use League\Csv\Writer;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index()
    {
        $savedReports = ReportConfig::where('user_id', Auth::id())->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'name' => $report->name,
                'selectedColumns' => json_decode($report->selected_columns, true),
                'filters' => json_decode($report->filters, true),
                'sortBy' => $report->sort_by,
                'sortOrder' => $report->sort_order,
            ];
        });

        return Inertia::render('Registry/Reports', [
            'registries' => [],
            'savedReports' => $savedReports,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'selectedColumns' => 'required|array|min:1',
            'filters' => 'array',
            'sortBy' => 'string|nullable',
            'sortOrder' => 'in:asc,desc|nullable',
        ]);

        $selectedColumns = $request->input('selectedColumns', []);
        $filters = $request->input('filters', []);
        $sortBy = $request->input('sortBy', '');
        $sortOrder = $request->input('sortOrder', 'asc');

        $query = Registry::query();

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
        $registries = $query->select($selectedColumns)->get();

        $savedReports = ReportConfig::where('user_id', Auth::id())->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'name' => $report->name,
                'selectedColumns' => json_decode($report->selected_columns, true),
                'filters' => json_decode($report->filters, true),
                'sortBy' => $report->sort_by,
                'sortOrder' => $report->sort_order,
            ];
        });

        return Inertia::render('Registry/Reports', [
            'registries' => $registries,
            'savedReports' => $savedReports,
        ]);
    }

    public function save(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'selectedColumns' => 'required|array|min:1',
            'filters' => 'array',
            'sortBy' => 'string|nullable',
            'sortOrder' => 'in:asc,desc|nullable',
        ]);

        ReportConfig::create([
            'user_id' => Auth::id(),
            'name' => $request->input('name'),
            'selected_columns' => json_encode($request->input('selectedColumns')),
            'filters' => json_encode($request->input('filters')),
            'sort_by' => $request->input('sortBy', ''),
            'sort_order' => $request->input('sortOrder', 'asc'),
        ]);

        return redirect()->route('reports.index');
    }

    public function export(Request $request, $format)
    {
        $request->validate([
            'selectedColumns' => 'required|array|min:1',
            'filters' => 'array',
            'sortBy' => 'string|nullable',
            'sortOrder' => 'in:asc,desc|nullable',
        ]);

        $selectedColumns = $request->input('selectedColumns', []);
        $filters = $request->input('filters', []);
        $sortBy = $request->input('sortBy', '');
        $sortOrder = $request->input('sortOrder', 'asc');

        $query = Registry::query();

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

        $registries = $query->select($selectedColumns)->get()->toArray();

        if ($format === 'csv') {
            $csv = Writer::createFromString();
            $csv->insertOne($selectedColumns);
            $csv->insertAll($registries);
            return response($csv->toString(), 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="report.csv"',
            ]);
        } elseif ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.reports', [
                'columns' => $selectedColumns,
                'registries' => $registries,
            ]);
            return $pdf->download('report.pdf');
        }

        return redirect()->back()->withErrors(['format' => 'Invalid export format']);
    }
}
