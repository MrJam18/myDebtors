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
            $table->dropForeign(['bailiff_id']);

            // Переименование столбца
            $table->renameColumn('bailiff_id', 'bailiff_department_id');

            // Добавление внешнего ключа
            $table->foreign('bailiff_department_id')->references('id')->on('bailiff_departments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('executive_documents', function (Blueprint $table) {
            $table->dropForeign(['bailiff_department_id']);

            $table->renameColumn('bailiff_department_id', 'bailiff_id');

            $table->foreign('bailiff_id')->references('id')->on('bailiff_departments');

        });
    }
};
