<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class RegistryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $sort = $request->input('sort', 'id:asc');
            $search = $request->input('search', '');
            $filters = json_decode($request->input('filters', '[]'), true);
            $dateFrom = $request->input('date_from', null);
            $dateTo = $request->input('date_to', null);

            Log::info('Registry index request', [
                'search' => $search,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'per_page' => $perPage,
                'page' => $page,
                'sort' => $sort,
                'filters' => $filters,
            ]);

            $query = Registry::query();

            // Apply global search
            if ($search) {
                $search = trim($search);
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(surname) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(given_name) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(sex) LIKE ?', ["%{$search}%"])
                        ->orWhere('travel_date', 'like', "%{$search}%")
                        ->orWhereRaw('LOWER(travel_reason) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(destination_coming_from) LIKE ?', ["%{$search}%"]);
                });
            }

            // Apply date range filter
            if ($dateFrom && $dateTo) {
                $query->whereBetween('travel_date', [$dateFrom, $dateTo]);
            } elseif ($dateFrom) {
                $query->where('travel_date', '>=', $dateFrom);
            } elseif ($dateTo) {
                $query->where('travel_date', '<=', $dateTo);
            }

            // Apply column filters
            foreach ($filters as $filter) {
                if (!empty($filter['id']) && !empty($filter['value'])) {
                    $query->where($filter['id'], 'like', "%{$filter['value']}%");
                }
            }

            // Apply sorting
            if ($sort) {
                [$sortColumn, $sortDirection] = explode(':', $sort);
                $validColumns = [
                    'surname', 'given_name', 'sex', 'travel_date',
                    'travel_reason', 'destination_coming_from', 'id'
                ];
                if (in_array($sortColumn, $validColumns) && in_array($sortDirection, ['asc', 'desc'])) {
                    $query->orderBy($sortColumn, $sortDirection);
                } else {
                    Log::warning('Invalid sort parameter', ['sort' => $sort]);
                    $query->orderBy('id', 'asc');
                }
            }

            // Paginate results
            $registry = $query->paginate($perPage, ['*'], 'page', $page);

            // Log the query results
            Log::info('Registry query results', [
                'total' => $registry->total(),
                'current_page' => $registry->currentPage(),
                'items' => $registry->items(),
            ]);

            return Inertia::render('registry/index', [
                'registry' => [
                    'data' => $registry->items(),
                    'links' => $registry->links(),
                    'meta' => [
                        'current_page' => $registry->currentPage(),
                        'last_page' => $registry->lastPage(),
                        'per_page' => $registry->perPage(),
                        'total' => $registry->total(),
                    ],
                ],
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching registry data: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return Inertia::render('Error', [
                'message' => 'Unable to load registry data.',
            ]);
        }
    }

    /**
     * Export all filtered records as JSON for CSV generation.
     */
    public function export(Request $request)
    {
        try {
            $sort = $request->input('sort', 'id:asc');
            $search = $request->input('search', '');
            $filters = json_decode($request->input('filters', '[]'), true);
            $dateFrom = $request->input('date_from', null);
            $dateTo = $request->input('date_to', null);

            Log::info('Export request', [
                'search' => $search,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort' => $sort,
                'filters' => $filters,
            ]);

            $query = Registry::query();

            // Apply global search
            if ($search) {
                $search = trim($search);
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(surname) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(given_name) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(sex) LIKE ?', ["%{$search}%"])
                        ->orWhere('travel_date', 'like', "%{$search}%")
                        ->orWhereRaw('LOWER(travel_reason) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('LOWER(destination_coming_from) LIKE ?', ["%{$search}%"]);
                });
            }

            // Apply date range filter
            if ($dateFrom && $dateTo) {
                $query->whereBetween('travel_date', [$dateFrom, $dateTo]);
            } elseif ($dateFrom) {
                $query->where('travel_date', '>=', $dateFrom);
            } elseif ($dateTo) {
                $query->where('travel_date', '<=', $dateTo);
            }

            // Apply column filters
            foreach ($filters as $filter) {
                if (!empty($filter['id']) && !empty($filter['value'])) {
                    $query->where($filter['id'], 'like', "%{$filter['value']}%");
                }
            }

            // Apply sorting
            if ($sort) {
                [$sortColumn, $sortDirection] = explode(':', $sort);
                $validColumns = [
                    'surname', 'given_name', 'sex', 'travel_date',
                    'travel_reason', 'destination_coming_from', 'id'
                ];
                if (in_array($sortColumn, $validColumns) && in_array($sortDirection, ['asc', 'desc'])) {
                    $query->orderBy($sortColumn, $sortDirection);
                } else {
                    $query->orderBy('id', 'asc');
                }
            }

            // Fetch all matching records
            $data = $query->get([
                'surname', 'given_name', 'nationality', 'country_of_residence',
                'document_type', 'document_no', 'dob', 'age', 'sex', 'travel_date',
                'direction', 'accommodation_address', 'note', 'travel_reason',
                'border_post', 'destination_coming_from'
            ]);

            return response()->json([
                'registry' => [
                    'data' => $data,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error exporting registry data: ' . $e->getMessage());
            return response()->json([
                'error' => 'Unable to export registry data.',
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return Inertia::render('registry/create', [
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error rendering create form: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load the create form.',
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Your existing store method
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $registry = Registry::findOrFail($id);
            return Inertia::render('registry/show', [
                'registry' => $registry,
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching registry record: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load registry record.',
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $registry = Registry::findOrFail($id);
            return Inertia::render('registry/edit', [
                'registry' => $registry,
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching registry record for edit: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load the edit form.',
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            Log::info('Update request data for Registry ID ' . $id, $request->all());
            $registry = Registry::findOrFail($id);
            $validated = $request->validate([
                'surname' => 'required|string|max:255',
                'given_name' => 'required|string|max:255',
                'nationality' => 'required|string|max:255',
                'country_of_residence' => 'required|string|max:255',
                'document_type' => 'required|string|max:255',
                'document_no' => 'required|string|max:255',
                'dob' => 'required|date',
                'age' => 'required|integer|min:0',
                'sex' => 'required|string|max:50',
                'travel_date' => 'required|date',
                'direction' => 'required|string|max:255',
                'accommodation_address' => 'required|string|max:255',
                'note' => 'nullable|string|max:1000',
                'travel_reason' => 'required|string|max:255',
                'border_post' => 'required|string|max:255',
                'destination_coming_from' => 'required|string|max:255',
            ]);
            Log::info('Validated data for Registry ID ' . $id, $validated);
            $registry->update($validated);
            Log::info('Registry record updated', ['id' => $registry->id, 'changes' => $registry->getChanges()]);
            return Redirect::route('registry.index')->with('success', 'Record updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating Registry record ID ' . $id . ': ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to update registry record.',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $registry = Registry::findOrFail($id);
            Log::info('Deleting Registry record', ['id' => $id]);
            $registry->delete();
            Log::info('Registry record deleted', ['id' => $id]);
            return Redirect::route('registry.index')->with('success', 'Record deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting Registry record ID ' . $id . ': ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to delete registry record.',
            ]);
        }
    }

    /**
     * Show the form for uploading a CSV file.
     */
    public function upload()
    {
        try {
            return Inertia::render('registry/upload', [
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error rendering CSV upload form: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load the CSV upload form.',
            ]);
        }
    }

    /**
     * Process and store the uploaded CSV file.
     */
    public function storeCsv(Request $request)
    {
        try {
            // Validate the uploaded file
            $request->validate([
                'csv_file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
            ]);

            $file = $request->file('csv_file');
            $path = $file->store('uploads', 'local');
            $handle = fopen(Storage::disk('local')->path($path), 'r');
            $header = fgetcsv($handle); // Read header row

            // Expected headers
            $expectedHeaders = [
                'surname', 'given_name', 'nationality', 'country_of_residence',
                'document_type', 'document_no', 'dob', 'age', 'sex', 'travel_date',
                'direction', 'accommodation_address', 'note', 'travel_reason',
                'border_post', 'destination_coming_from'
            ];

            // Validate headers
            if ($header !== $expectedHeaders) {
                Storage::disk('local')->delete($path);
                return Redirect::back()->withErrors(['csv_file' => 'Invalid CSV headers. Expected: ' . implode(', ', $expectedHeaders)]);
            }

            $recordsCreated = 0;
            while (($row = fgetcsv($handle)) !== false) {
                // Skip if document_no already exists
                if (Registry::where('document_no', $row[5])->exists()) {
                    Log::warning('Skipping duplicate document_no: ' . $row[5]);
                    continue;
                }

                // Create record with validation
                try {
                    Registry::create([
                        'surname' => $row[0] ?? '',
                        'given_name' => $row[1] ?? '',
                        'nationality' => $row[2] ?? '',
                        'country_of_residence' => $row[3] ?? '',
                        'document_type' => $row[4] ?? '',
                        'document_no' => $row[5] ?? '',
                        'dob' => !empty($row[6]) ? date('Y-m-d', strtotime(str_replace('/', '-', $row[6]))) : null,
                        'age' => (int)($row[7] ?? 0),
                        'sex' => $row[8] ?? '',
                        'travel_date' => !empty($row[9]) ? date('Y-m-d', strtotime(str_replace('/', '-', $row[9]))) : null,
                        'direction' => $row[10] ?? '',
                        'accommodation_address' => $row[11] ?? '',
                        'note' => !empty($row[12]) ? $row[12] : null,
                        'travel_reason' => $row[13] ?? '',
                        'border_post' => $row[14] ?? '',
                        'destination_coming_from' => $row[15] ?? '',
                    ]);
                    $recordsCreated++;
                } catch (\Exception $e) {
                    Log::warning('Failed to create Registry record from CSV row: ' . $e->getMessage(), ['row' => $row]);
                    continue;
                }
            }
            fclose($handle);
            Storage::disk('local')->delete($path);

            Log::info('CSV uploaded successfully', [
                'file' => $file->getClientOriginalName(),
                'records_created' => $recordsCreated,
            ]);
            return Redirect::route('registry.index')->with('success', "CSV uploaded, $recordsCreated records created.");
        } catch (\Exception $e) {
            Log::error('Error processing CSV: ' . $e->getMessage());
            return Redirect::back()->withErrors(['csv_file' => 'Error processing CSV: ' . $e->getMessage()]);
        }
    }
}
