<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransitLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'name',
        'short_name',
        'type',
        'color',
        'text_color',
        'operator',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    const TYPE_METRO = 'metro';
    const TYPE_BUS = 'bus';
    const TYPE_TRAM = 'tram';
    const TYPE_RER = 'rer';
    const TYPE_TRAIN = 'train';

    // ─── Relationships ─────────────────────────────────
    public function stops()
    {
        return $this->belongsToMany(TransitStop::class, 'line_stop')
            ->withPivot('order', 'direction')
            ->orderByPivot('order');
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class, 'line_id');
    }

    public function crowdPredictions()
    {
        return $this->hasMany(CrowdPrediction::class, 'line_id');
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
