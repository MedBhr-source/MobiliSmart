<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('origin_name');
            $table->decimal('origin_lat', 10, 7);
            $table->decimal('origin_lng', 10, 7);
            $table->string('destination_name');
            $table->decimal('destination_lat', 10, 7);
            $table->decimal('destination_lng', 10, 7);
            $table->text('geometry')->nullable(); // GeoJSON polyline
            $table->integer('distance_meters');
            $table->integer('duration_seconds');
            $table->integer('carbon_grams')->default(0);
            $table->integer('cost_cents')->default(0);
            $table->jsonb('modes'); // ['metro', 'walk', 'bike']
            $table->jsonb('steps'); // Detailed step-by-step instructions
            $table->timestamps();

            $table->index(['origin_lat', 'origin_lng']);
            $table->index(['destination_lat', 'destination_lng']);
        });

        // Pivot: saved routes per user
        Schema::create('saved_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('route_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'route_id']);
        });

        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('route_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['planned', 'active', 'completed', 'cancelled'])->default('planned');
            $table->jsonb('modes_used')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('actual_duration_seconds')->nullable();
            $table->decimal('carbon_saved', 10, 2)->default(0);
            $table->tinyInteger('rating')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
        Schema::dropIfExists('saved_routes');
        Schema::dropIfExists('routes');
    }
};
