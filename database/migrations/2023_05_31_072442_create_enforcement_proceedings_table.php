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
        Schema::create('enforcement_proceedings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('contract_id')->constrained();
            $table->foreignId('executive_document_id')->constrained();
            $table->foreignId('recovered_sum_id')->constrained('money_sums');
            $table->string('number');
            $table->date('begin_date');
            $table->date('end_date')->nullable();
            $table->foreignId('status_id')->constrained('enforcement_proceeding_statuses');
            $table->date('status_date');
            $table->foreignId('bailiff_id')->constrained();
            $table->foreignId('bailiff_department_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enforcement_proceedings');
    }
};
