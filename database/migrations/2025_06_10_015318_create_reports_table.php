<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('selected_columns');
            $table->json('filters')->nullable();
            $table->string('sort_by')->nullable();
            $table->string('sort_order')->default('asc');
            $table->string('display_type')->default('table');
            $table->string('chart_type')->nullable();
            $table->json('pivot_config')->nullable();
            $table->json('cards')->nullable();
            $table->text('custom_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('reports');
    }
};
