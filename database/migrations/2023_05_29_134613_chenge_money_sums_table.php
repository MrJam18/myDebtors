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
        Schema::table('money_sums', function (Blueprint $table) {
            $table->float('sum', 20)->change();
            $table->float('percents', 15)->change();
            $table->float('penalties', 15)->change();
            $table->float('main', 15)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
