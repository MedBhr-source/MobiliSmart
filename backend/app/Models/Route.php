<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'origin_name',
        'origin_lat',
        'origin_lng',
        'destination_name',
        'destination_lat',
        'destination_lng',
        'geometry',
        'distance_meters',
        'duration_seconds',
        'carbon_grams',
        'cost_cents',
        'modes',
        'steps',
    ];

    protected function casts(): array
    {
        return [
            'origin_lat' => 'float',
            'origin_lng' => 'float',
            'destination_lat' => 'float',
            'destination_lng' => 'float',
            'distance_meters' => 'integer',
            'duration_seconds' => 'integer',
            'carbon_grams' => 'integer',
            'cost_cents' => 'integer',
            'modes' => 'array',
            'steps' => 'array',
        ];
    }

    // ─── Relationships ─────────────────────────────────
    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_routes')
            ->withTimestamps();
    }

    // ─── Accessors ─────────────────────────────────────
    public function getDurationFormattedAttribute(): string
    {
        $minutes = intdiv($this->duration_seconds, 60);
        if ($minutes < 60) {
            return "{$minutes} min";
        }
        $hours = intdiv($minutes, 60);
        $remaining = $minutes % 60;
        return "{$hours}h{$remaining}";
    }

    public function getDistanceFormattedAttribute(): string
    {
        if ($this->distance_meters < 1000) {
            return "{$this->distance_meters} m";
        }
        return round($this->distance_meters / 1000, 1) . ' km';
    }

    public function getCarbonFormattedAttribute(): string
    {
        if ($this->carbon_grams < 1000) {
            return "{$this->carbon_grams} g CO₂";
        }
        return round($this->carbon_grams / 1000, 1) . ' kg CO₂';
    }
}
