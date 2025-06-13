<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registry', function (Blueprint $table) {
            $table->id();
            $table->string('surname');
            $table->string('given_name');
            $table->string('nationality');
            $table->string('country_of_residence');
            $table->integer('national_id_number')->unique;
            $table->string('document_type');
            $table->string('document_no');
            $table->string('dob');
            $table->integer('age');
            $table->string('sex');
            $table->string('travel_date')->nullable();
            $table->string('direction');
            $table->string('accommodation_address');
            $table->string('note')->nullable();
            $table->string('travel_reason');
            $table->string('border_post');
            $table->string('destination_coming_from');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registry');
    }
};
