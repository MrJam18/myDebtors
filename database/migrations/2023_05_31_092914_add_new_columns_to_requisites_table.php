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
        Schema::table('requisites', function (Blueprint $table) {
            $table->string('inn')->nullable();
            $table->string('kpp')->nullable();
            $table->string('recipient')->nullable();
            $table->string('kbk')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requisites', function (Blueprint $table) {
            $table->dropColumn('inn');
            $table->dropColumn('kpp');
            $table->dropColumn('recipient');
            $table->dropColumn('kbk');
        });
    }
};
