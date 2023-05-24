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
        Schema::create('passports', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('series');
            $table->string('number');
            $table->string('issued_by')->nullable();
            $table->date('issued_date')->nullable();
            $table->string('gov_unit_code')->nullable();
            $table->foreignId('type_id')->constrained('passport_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passports');
    }
};
