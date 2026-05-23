<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crowd_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stop_id')->constrained('transit_stops')->cascadeOnDelete();
            $table->foreignId('line_id')->constrained('transit_lines')->cascadeOnDelete();
            $table->tinyInteger('predicted_level'); // 1-5
            $table->decimal('confidence', 5, 4)->default(0.0); // 0.0000 to 1.0000
            $table->timestamp('predicted_for');
            $table->tinyInteger('day_of_week'); // 0=Sunday, 6=Saturday
            $table->tinyInteger('hour'); // 0-23
            $table->string('model_version')->default('v1.0');
            $table->timestamps();

            $table->index(['stop_id', 'line_id', 'day_of_week', 'hour']);
            $table->index('predicted_for');
        });

        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('line_id')->nullable()->constrained('transit_lines')->nullOnDelete();
            $table->enum('type', ['delay', 'disruption', 'maintenance', 'info'])->default('info');
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->string('title');
            $table->text('message');
            $table->timestamp('active_from')->nullable();
            $table->timestamp('active_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'severity']);
            $table->index('line_id');
        });

        Schema::create('bike_stations', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable()->unique();
            $table->string('name');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->string('address')->nullable();
            $table->integer('capacity')->default(0);
            $table->integer('available_bikes')->default(0);
            $table->integer('available_docks')->default(0);
            $table->boolean('has_electric')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->index(['lat', 'lng']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bike_stations');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('crowd_predictions');
    }
};
