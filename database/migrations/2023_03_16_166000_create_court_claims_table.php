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
        Schema::create('court_claims', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->float('fee');
            $table->date('sending_date');
            $table->date('status_date');
            $table->foreignId('status_id')->constrained('court_claim_statuses');
            $table->foreignId('type_id')->constrained('court_claim_types');
            $table->foreignId('court_id')->constrained();
            $table->foreignId('contract_id')->constrained();
            $table->foreignId('agent_id')->constrained();
            $table->foreignId('money_sum_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('court_claims');
    }
};
