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
        Schema::table('executive_documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('bailiff_id');
            $table->foreignId('bailiff_department_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('executive_documents', function (Blueprint $table) {
            $table->foreignId('bailiff_id')->constrained();
            $table->dropConstrainedForeignId('bailiff_department_id');
        });
    }
};
