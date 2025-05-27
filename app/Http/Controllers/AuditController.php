<?php

namespace App\Http\Controllers;

use OwenIt\Auditing\Models\Audit;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index()
    {
        $audits = Audit::with(['user'])
            ->where('auditable_type', \App\Models\Registry::class)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Audits/Index', [
            'auth' => [
                'user' => auth()->user() ? auth()->user()->only(['id', 'name', 'email', 'avatar']) : null,
            ],
            'audits' => [
                'data' => $audits->items(),
                'links' => $audits->links(),
                'meta' => [
                    'current_page' => $audits->currentPage(),
                    'last_page' => $audits->lastPage(),
                    'per_page' => $audits->perPage(),
                    'total' => $audits->total(),
                ],
            ],
        ]);
    }
}
