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
        Schema::table('court_claims', function (Blueprint $table) {
            $table->boolean('is_ignored_payments')->default(false);
            $table->boolean('is_contract_jurisdiction')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('court_claims', function (Blueprint $table) {
            $table->dropColumn('is_ignored_payments');
            $table->dropColumn('is_contract_jurisdiction');
        });
    }
};
