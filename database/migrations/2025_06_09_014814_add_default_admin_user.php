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

        // Check if default admin doesn't exist
        $defaultEmail = 'htevilili@vanuatu.gov.vu';
        if (!\App\Models\User::where('email', $defaultEmail)->exists()) {
            \App\Models\User::create([
                'name' => 'Herman Tevilili',
                'email' => $defaultEmail,
                'password' => Hash::make('Admin123!'), // Default password
                'role' => 'admin',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Optionally remove the default admin (for testing)
        $defaultEmail = 'htevilili@vanuatu.gov.vu';
        \App\Models\User::where('email', $defaultEmail)->delete();
    }
}
