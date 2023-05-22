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
        Schema::create('cessions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->date('transfer_date');
            $table->float('sum');
            $table->string('number')->nullable();
            $table->text('text');
            $table->boolean('use_default_text');
            $table->foreignId('cession_group_id')->constrained();
            $table->foreignId('assignor_id')->constrained('creditors');
            $table->foreignId('assignee_id')->constrained('creditors');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cessions');
    }
};
