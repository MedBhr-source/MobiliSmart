<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'route_id',
        'status',
        'modes_used',
        'started_at',
        'ended_at',
        'actual_duration_seconds',
        'carbon_saved',
        'rating',
        'feedback',
    ];

    protected function casts(): array
    {
        return [
            'modes_used' => 'array',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'actual_duration_seconds' => 'integer',
            'carbon_saved' => 'float',
            'rating' => 'integer',
        ];
    }

    const STATUS_PLANNED = 'planned';
    const STATUS_ACTIVE = 'active';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // ─── Relationships ─────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    // ─── Scopes ────────────────────────────────────────
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
