<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'line_id',
        'type',
        'severity',
        'title',
        'message',
        'active_from',
        'active_until',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'active_from' => 'datetime',
            'active_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    const TYPE_DELAY = 'delay';
    const TYPE_DISRUPTION = 'disruption';
    const TYPE_MAINTENANCE = 'maintenance';
    const TYPE_INFO = 'info';

    const SEVERITY_LOW = 'low';
    const SEVERITY_MEDIUM = 'medium';
    const SEVERITY_HIGH = 'high';
    const SEVERITY_CRITICAL = 'critical';

    // ─── Relationships ─────────────────────────────────
    public function line()
    {
        return $this->belongsTo(TransitLine::class, 'line_id');
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('active_until')
                    ->orWhere('active_until', '>', now());
            });
    }

    public function scopeBySeverity($query, string $severity)
    {
        return $query->where('severity', $severity);
    }
}
