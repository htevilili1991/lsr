<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class AddDefaultAdminUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // No schema changes needed if table already exists
        });

        // Overwrite or create the admin user
        $defaultEmail = 'htevilili@vanuatu.gov.vu';
        \App\Models\User::updateOrCreate(
            ['email' => $defaultEmail], // Match on email
            [
                'name' => 'Herman Tevilili',
                'email' => $defaultEmail,
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
            ]
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Delete the user to reverse the migration
        $defaultEmail = 'htevilili@vanuatu.gov.vu';
        \App\Models\User::where('email', $defaultEmail)->delete();
    }
}
