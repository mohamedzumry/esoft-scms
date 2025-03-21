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
        Schema::table('events', function (Blueprint $table) {
            // Drop the existing foreign key constraint and column
            $table->dropForeign(['created_by']); // Drop the foreign key constraint
            $table->dropColumn('created_by');   // Drop the column itself
        });

        Schema::table('events', function (Blueprint $table) {
            // Add the new foreign key column with the correct reference
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Drop the new foreign key constraint and column
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });

        Schema::table('events', function (Blueprint $table) {
            // Re-add the old foreign key column
            $table->foreignId('created_by')->constrained()->onDelete('cascade');
        });
    }
};
