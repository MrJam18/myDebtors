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
        Schema::table('enforcement_proceedings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('bailiff_department_id');
            $table->dropConstrainedForeignId('contract_id');
            $table->dropConstrainedForeignId('recovered_sum_id');
            $table->float('sum');
            $table->float('percents');
            $table->float('penalties');
            $table->float('main');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enforcement_proceedings', function (Blueprint $table) {
            $table->foreignId('bailiff_department_id');
            $table->foreignId('contract_id');
            $table->foreignId('recovered_sum_id');
            $table->dropColumn('sum');
            $table->dropColumn('percents');
            $table->dropColumn('penalties');
            $table->dropColumn('main');
        });
    }
};
