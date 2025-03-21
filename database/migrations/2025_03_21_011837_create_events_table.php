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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Title of the event
            $table->foreignId('event_category_id')->constrained()->onDelete('cascade'); // Foreign key to event_categories
            $table->foreignId('created_by')->constrained()->onDelete('cascade'); // Foreign key to event_categories
            $table->date('date'); // Date of the event
            $table->time('time'); // Time of the event
            $table->string('venue'); // Venue of the event
            $table->string('target_audience'); // Target audience
            $table->string('event_image'); // Image URL or path
            $table->text('description'); // Description of the event
            $table->string('registration_link')->nullable(); // Registration link (optional)
            $table->timestamps();
        });

        Schema::create('event_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Name of the category
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('event_categories');
    }
};
