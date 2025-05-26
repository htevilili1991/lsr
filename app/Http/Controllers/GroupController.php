<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        return Inertia::render('Groups/Index', [
            'auth' => [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                    'avatar' => auth()->user()->avatar,
                    'email_verified_at' => auth()->user()->email_verified_at?->toDateTimeString(),
                    'created_at' => auth()->user()->created_at?->toDateTimeString(),
                    'updated_at' => auth()->user()->updated_at?->toDateTimeString(),
                    'roles' => auth()->user()->getRoleNames()->toArray(),
                    'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
            'groups' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:roles,name']);
        Role::create(['name' => $request->name]);
        return redirect()->route('groups.index')->with('success', 'Group created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate(['name' => 'required|string|max:255|unique:roles,name,' . $role->id]);
        $role->update(['name' => $request->name]);
        return redirect()->route('groups.index')->with('success', 'Group updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('groups.index')->with('success', 'Group deleted successfully.');
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $request->validate(['permissions' => 'array', 'permissions.*' => 'exists:permissions,name']);
        $role->syncPermissions($request->permissions);
        return redirect()->route('groups.index')->with('success', 'Permissions updated successfully.');
    }
}
