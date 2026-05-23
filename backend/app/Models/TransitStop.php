<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransitStop extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'name',
        'lat',
        'lng',
        'address',
        'type',
        'accessibility',
        'has_shelter',
        'zone',
    ];

    protected function casts(): array
    {
        return [
            'lat' => 'float',
            'lng' => 'float',
            'accessibility' => 'boolean',
            'has_shelter' => 'boolean',
        ];
    }

    // ─── Relationships ─────────────────────────────────
    public function lines()
    {
        return $this->belongsToMany(TransitLine::class, 'line_stop')
            ->withPivot('order', 'direction');
    }

    public function crowdPredictions()
    {
        return $this->hasMany(CrowdPrediction::class, 'stop_id');
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeNearby($query, float $lat, float $lng, float $radiusKm = 1.0)
    {
        // Haversine formula for distance in km
        $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat))))";

        return $query
            ->selectRaw("*, {$haversine} AS distance", [$lat, $lng, $lat])
            ->whereRaw("{$haversine} < ?", [$lat, $lng, $lat, $radiusKm])
            ->orderBy('distance');
    }

    public function scopeAccessible($query)
    {
        return $query->where('accessibility', true);
    }
}
