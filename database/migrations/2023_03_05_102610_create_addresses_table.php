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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('region_id')->constrained();
            $table->foreignId('settlement_id')->constrained();
            $table->foreignId('street_id')->constrained();
            $table->foreignId('area_id')->nullable()->constrained();
            $table->foreignId('country_id')->constrained();
            $table->string('postal_code');
            $table->string('block')->nullable();
            $table->string('flat')->nullable();
            $table->string('house');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
