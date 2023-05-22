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
        Schema::create('debtors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('birth_date');
            $table->string('birth_place', 3000);
            $table->foreignId('address_id')->constrained();
            $table->foreignId('passport_id')->nullable()->constrained();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('name_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debtors');
    }
};
