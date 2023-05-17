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
        Schema::create('creditors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('short');
            $table->string('court_identifier');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('type_id')->constrained('creditor_types');
            $table->foreignId('address_id')->constrained();
            $table->foreignId('default_cession_id')->nullable()->constrained('cession_groups');
            $table->foreignId('requisites_id')->constrained('requisites');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creditors');
    }
};
