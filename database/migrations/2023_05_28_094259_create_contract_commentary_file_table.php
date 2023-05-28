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
        Schema::create('contract_commentary_file', function (Blueprint $table) {
            $table->id();
            $table->string('file_url');
            $table->foreignId('commentary_id')->constrained('contract_commentary');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('agents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('passport_id');
        });
    }
};
