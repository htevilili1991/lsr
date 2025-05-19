<?php

namespace App\Http\Controllers;

use App\Models\Registry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
            Log::error('Error fetching registry record: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'Unable to load registry record.',
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
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
            $registry->update($validated);
            return Redirect::route('registry.index')->with('success', 'Record updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating registry record: ' . $e->getMessage());
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
            $registry->delete();
            return response()->json(['message' => 'Record deleted successfully.']);
        } catch (\Exception $e) {
            Log::error('Error deleting registry record: ' . $e->getMessage());
            return response()->json(['message' => 'Unable to delete registry record.'], 500);
        }
    }
}
