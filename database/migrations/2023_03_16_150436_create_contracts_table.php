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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('number')->nullable();
            $table->decimal('issued_sum');
            $table->date('issued_date');
            $table->date('due_date');
            $table->decimal('percent', 5);
            $table->decimal('penalty', 5);
            $table->timestamp('status_changed_at');
            $table->boolean('is_contract_jurisdiction')->default(false);
            $table->foreignId('status_id')->constrained('contract_statuses');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('cession_id')->nullable()->constrained('cession_groups');
            $table->foreignId('creditor_id')->constrained();
            $table->foreignId('type_id')->constrained('contract_types');
            $table->foreignId('debtor_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
