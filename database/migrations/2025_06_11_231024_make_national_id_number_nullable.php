<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registry', function (Blueprint $table) {
            $table->integer('national_id_number')->nullable()->change(); // Make nullable
        });
    }

    public function down(): void
    {
        Schema::table('registry', function (Blueprint $table) {
            $table->integer('national_id_number')->nullable(false)->change(); // Revert to non-nullable
        });
    }
};
