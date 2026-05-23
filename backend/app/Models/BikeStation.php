<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BikeStation extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'name',
        'lat',
        'lng',
        'address',
        'capacity',
        'available_bikes',
        'available_docks',
        'has_electric',
        'is_active',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'lat' => 'float',
            'lng' => 'float',
            'capacity' => 'integer',
            'available_bikes' => 'integer',
            'available_docks' => 'integer',
            'has_electric' => 'boolean',
            'is_active' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeNearby($query, float $lat, float $lng, float $radiusKm = 1.0)
    {
        $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat))))";

        return $query
            ->selectRaw("*, {$haversine} AS distance", [$lat, $lng, $lat])
            ->whereRaw("{$haversine} < ?", [$lat, $lng, $lat, $radiusKm])
            ->orderBy('distance');
    }

    public function scopeWithBikes($query)
    {
        return $query->where('available_bikes', '>', 0);
    }

    public function scopeWithDocks($query)
    {
        return $query->where('available_docks', '>', 0);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Accessors ─────────────────────────────────────
    public function getOccupancyPercentAttribute(): float
    {
        if ($this->capacity === 0) return 0;
        return round(($this->available_bikes / $this->capacity) * 100, 1);
    }
}
