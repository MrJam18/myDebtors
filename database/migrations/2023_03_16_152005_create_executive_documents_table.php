<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('executive_documents', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->float('fee');
            $table->string('number');
            $table->date('issued_date');
            $table->string('resolution_number')->nullable();
            $table->string('resolution_date')->nullable();
            $table->foreignId('type_id')->constrained('executive_document_types');
            $table->foreignId('contract_id')->constrained();
            $table->foreignId('bailiff_id')->constrained();
            $table->foreignId('court_id')->constrained();
            $table->foreignId('money_sum_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('executive_documents');
    }
};
