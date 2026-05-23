<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transit_lines', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable()->unique();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->enum('type', ['metro', 'bus', 'tram', 'rer', 'train']);
            $table->string('color', 7)->default('#3B82F6');
            $table->string('text_color', 7)->default('#FFFFFF');
            $table->string('operator')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_active']);
        });

        Schema::create('transit_stops', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable()->unique();
            $table->string('name');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->string('address')->nullable();
            $table->enum('type', ['metro', 'bus', 'tram', 'rer', 'train'])->default('bus');
            $table->boolean('accessibility')->default(false);
            $table->boolean('has_shelter')->default(false);
            $table->string('zone')->nullable();
            $table->timestamps();

            $table->index(['lat', 'lng']);
            $table->index('type');
        });

        // Pivot table: line ↔ stop
        Schema::create('line_stop', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transit_line_id')->constrained('transit_lines')->cascadeOnDelete();
            $table->foreignId('transit_stop_id')->constrained('transit_stops')->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->string('direction')->nullable();

            $table->unique(['transit_line_id', 'transit_stop_id', 'direction']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('line_stop');
        Schema::dropIfExists('transit_stops');
        Schema::dropIfExists('transit_lines');
    }
};
