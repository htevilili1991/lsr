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

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

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
    public function csvUpload()
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
     * Handle the CSV file upload and append data to the registry table.
     */
    public function storeCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            $file = $request->file('csv_file');
            $csv = Reader::createFromPath($file->getPathname(), 'r');
            $csv->setHeaderOffset(0); // Assumes the first row is the header

            $inserted = 0;
            $skipped = 0;

            foreach ($csv as $record) {
                // Check for duplicate based on 'document_no'
                if (Registry::where('document_no', $record['document_no'])->exists()) {
                    $skipped++;
                    continue;
                }

                Registry::create([
                    'surname' => $record['surname'],
                    'given_name' => $record['given_name'],
                    'nationality' => $record['nationality'],
                    'country_of_residence' => $record['country_of_residence'],
                    'document_type' => $record['document_type'],
                    'document_no' => $record['document_no'],
                    'dob' => $record['dob'],
                    'age' => $record['age'],
                    'sex' => $record['sex'],
                    'travel_date' => $record['travel_date'],
                    'direction' => $record['direction'],
                    'accommodation_address' => $record['accommodation_address'],
                    'note' => $record['note'] ?? null,
                    'travel_reason' => $record['travel_reason'],
                    'border_post' => $record['border_post'],
                    'destination_coming_from' => $record['destination_coming_from'],
                ]);
                $inserted++;
            }

            $message = "CSV processed: $inserted records added, $skipped records skipped (duplicates).";
            return Redirect::route('registry.csv.upload')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Error processing CSV: ' . $e->getMessage());
            return Redirect::route('registry.csv.upload')->with('error', 'Error processing CSV: ' . $e->getMessage());
        }
    }

}
