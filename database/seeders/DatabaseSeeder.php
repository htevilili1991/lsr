<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Permission::create(['name' => 'create groups']);
        Permission::create(['name' => 'edit groups']);
        Permission::create(['name' => 'delete groups']);
        Permission::create(['name' => 'assign permissions']);
        Permission::create(['name' => 'view groups']);

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(['create groups', 'edit groups', 'delete groups', 'assign permissions', 'view groups']);

        $user = User::first();
        if ($user) {
            $user->assignRole('admin');
        }
    }
}
