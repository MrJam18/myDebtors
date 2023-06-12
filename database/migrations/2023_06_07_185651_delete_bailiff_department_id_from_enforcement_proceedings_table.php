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
            $table->dropForeign(['enforcement_proceedings_bailiff_department_id_foreign']);
            $table->dropColumn('bailiff_department_id');
            $table->dropForeign('enforcement_proceedings_contract_id_foreign');
            $table->dropColumn('contract_id');
            $table->dropForeign('enforcement_proceedings_recovered_sum_id_foreign');
            $table->dropColumn('recovery_sum_id');
            //так же добавляю столбцы о которых говорили
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
            //
        });
    }
};
