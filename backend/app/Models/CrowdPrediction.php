<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrowdPrediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'stop_id',
        'line_id',
        'predicted_level',
        'confidence',
        'predicted_for',
        'day_of_week',
        'hour',
        'model_version',
    ];

    protected function casts(): array
    {
        return [
            'predicted_level' => 'integer', // 1-5 scale
            'confidence' => 'float',
            'predicted_for' => 'datetime',
            'day_of_week' => 'integer',
            'hour' => 'integer',
        ];
    }

    const LEVEL_EMPTY = 1;
    const LEVEL_LOW = 2;
    const LEVEL_MODERATE = 3;
    const LEVEL_HIGH = 4;
    const LEVEL_PACKED = 5;

    public static function levelLabels(): array
    {
        return [
            self::LEVEL_EMPTY => 'Vide',
            self::LEVEL_LOW => 'Peu fréquenté',
            self::LEVEL_MODERATE => 'Modéré',
            self::LEVEL_HIGH => 'Fréquenté',
            self::LEVEL_PACKED => 'Bondé',
        ];
    }

    // ─── Relationships ─────────────────────────────────
    public function stop()
    {
        return $this->belongsTo(TransitStop::class, 'stop_id');
    }

    public function line()
    {
        return $this->belongsTo(TransitLine::class, 'line_id');
    }

    // ─── Accessors ─────────────────────────────────────
    public function getLevelLabelAttribute(): string
    {
        return self::levelLabels()[$this->predicted_level] ?? 'Inconnu';
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeForTime($query, $dateTime)
    {
        return $query->where('day_of_week', $dateTime->dayOfWeek)
            ->where('hour', $dateTime->hour);
    }

    public function scopeHighConfidence($query, float $threshold = 0.7)
    {
        return $query->where('confidence', '>=', $threshold);
    }
}
