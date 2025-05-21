<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class RegistryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $registry = Registry::all();
            return Inertia::render('registry/index', [
                'registry' => $registry,
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
        // Not implemented yet
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Not implemented yet
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
        // Not implemented yet
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
        // Not implemented yet
    }

    /**
     * Display the CSV upload form.
    */
    public function upload()
    {
        try {
            return Inertia::render('registry/Upload', [
                'auth' => [
                    'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
                ],
                'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error rendering CSV upload page: ' . $e->getMessage());
            return Inertia::render('registry/Error', [
                'message' => 'Unable to load CSV upload page.',
            ]);
        }
    }

    /**
     * Process and store CSV data.
     */
    public function storeCsv(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'csv_file' => 'required|file|mimes:csv,txt|max:2048',
            ]);

            if ($validator->fails()) {
                return Redirect::back()->withErrors($validator);
            }

            $csv = Reader::createFromPath($request->file('csv_file')->getPathname(), 'r');
            $csv->setHeaderOffset(0);

            $expectedHeaders = [
                'surname', 'given_name', 'nationality', 'country_of_residence',
                'document_type', 'document_no', 'dob', 'age', 'sex',
                'travel_date', 'direction', 'accommodation_address', 'note',
                'travel_reason', 'border_post', 'destination_coming_from'
            ];

            $headers = $csv->getHeader();
            if (array_diff($expectedHeaders, $headers)) {
                return Redirect::back()->withErrors(['csv_file' => 'CSV file headers do not match expected format.']);
            }

            foreach ($csv->getRecords() as $record) {
                Validator::make($record, [
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
                ])->validate();

                Registry::create($record);
            }

            return Redirect::route('registry.upload')->with('success', 'CSV uploaded and processed successfully.');
        } catch (\Exception $e) {
            Log::error('CSV Upload Error: ' . $e->getMessage());
            return Redirect::back()->withErrors(['csv_file' => 'Error processing CSV file.']);
        }
    }
}
