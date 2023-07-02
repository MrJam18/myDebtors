<?php

declare(strict_types=1);

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
<<<<<<<< HEAD:database/migrations/2023_05_23_124731_add_passport_id_column_in_agents_table.php
//        Schema::table('agents', function (Blueprint $table) {
//            $table->foreignId('passport_id')->constrained();
//        });
========
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->timestamps();
        });
>>>>>>>> main:database/migrations/2023_05_30_181042_create_files_table.php
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
