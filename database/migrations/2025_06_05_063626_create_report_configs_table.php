<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('report_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('selected_columns');
            $table->json('filters');
            $table->string('sort_by')->nullable();
            $table->string('sort_order')->default('asc');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('report_configs');
    }
};
