<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

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

            $query = Registry::query();

            // Apply global search
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('surname', 'like', "%{$search}%")
                        ->orWhere('given_name', 'like', "%{$search}%")
                        ->orWhere('sex', 'like', "%{$search}%")
                        ->orWhere('travel_date', 'like', "%{$search}%")
                        ->orWhere('travel_reason', 'like', "%{$search}%")
                        ->orWhere('destination_coming_from', 'like', "%{$search}%");
                });
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
                // Validate sort column to prevent SQL injection
                $validColumns = [
                    'surname', 'given_name', 'sex', 'travel_date',
                    'travel_reason', 'destination_coming_from', 'id'
                ];
                if (in_array($sortColumn, $validColumns) && in_array($sortDirection, ['asc', 'desc'])) {
                    $query->orderBy($sortColumn, $sortDirection);
                } else {
                    $query->orderBy('id', 'asc'); // Fallback
                }
            }

            // Paginate results
            $registry = $query->paginate($perPage, ['*'], 'page', $page);

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
            Log::error('Error fetching registry data: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load registry data.',
            ]);
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
            \Log::info('Update request data:', $request->all());
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
            \Log::info('Validated data:', $validated);
            $registry->update($validated);
            \Log::info('Record updated:', $registry->toArray());
            return Redirect::route('registry.index')->with('success', 'Record updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error updating registry record: ' . $e->getMessage());
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
            \Log::info('Deleting registry record:', $registry->toArray());
            $registry->delete();
            return Redirect::route('registry.index')->with('success', 'Record deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error deleting registry record: ' . $e->getMessage());
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

            // Read the CSV
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

            $records = [];
            while (($row = fgetcsv($handle)) !== false) {
                // Skip if document_no already exists
                if (Registry::where('document_no', $row[5])->exists()) {
                    Log::warning('Skipping duplicate document_no: ' . $row[5]);
                    continue;
                }

                $records[] = [
                    'surname' => $row[0],
                    'given_name' => $row[1],
                    'nationality' => $row[2],
                    'country_of_residence' => $row[3],
                    'document_type' => $row[4],
                    'document_no' => $row[5],
                    'dob' => !empty($row[6]) ? date('Y-m-d', strtotime(str_replace('/', '-', $row[6]))) : null,
                    'age' => (int)$row[7],
                    'sex' => $row[8],
                    'travel_date' => !empty($row[9]) ? date('Y-m-d', strtotime(str_replace('/', '-', $row[9]))) : null,
                    'direction' => $row[10],
                    'accommodation_address' => $row[11],
                    'note' => !empty($row[12]) ? $row[12] : null,
                    'travel_reason' => $row[13],
                    'border_post' => $row[14],
                    'destination_coming_from' => $row[15],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            fclose($handle);

            // Delete the temporary file
            Storage::disk('local')->delete($path);

            // Insert records in chunks
            foreach (array_chunk($records, 100) as $chunk) {
                Registry::insert($chunk);
            }

            Log::info('CSV uploaded successfully', ['file' => $file->getClientOriginalName(), 'records' => count($records)]);
            return Redirect::route('registry.index')->with('success', 'CSV uploaded and records inserted successfully.');
        } catch (\Exception $e) {
            Log::error('Error processing CSV: ' . $e->getMessage());
            return Redirect::back()->withErrors(['csv_file' => 'Error processing CSV: ' . $e->getMessage()]);
        }
    }
}
