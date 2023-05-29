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
        Schema::create('contract_comments', function (Blueprint $table) {
            $table->id();
            $table->string('commentary', 500);
            $table->foreignId('contract_id')->constrained('contracts');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('contract_comment_id')->constrained('contract_comment_files');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_comments');
    }
};
