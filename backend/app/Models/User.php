<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'google_id',
        'preferences',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'preferences' => 'array',
        ];
    }

    // ─── Default preferences ───────────────────────────
    public static function defaultPreferences(): array
    {
        return [
            'mode_priority' => 'balanced',  // balanced, eco, fast, cheap
            'avoid_modes' => [],
            'max_walking_minutes' => 15,
            'accessibility' => false,
            'notifications' => true,
            'dark_mode' => false,
            'language' => 'fr',
        ];
    }

    // ─── Relationships ─────────────────────────────────
    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function savedRoutes()
    {
        return $this->belongsToMany(Route::class, 'saved_routes')
            ->withTimestamps();
    }

    // ─── Accessors ─────────────────────────────────────
    public function getPreferencesAttribute($value): array
    {
        return array_merge(
            self::defaultPreferences(),
            $value ? json_decode($value, true) : []
        );
    }

    // ─── Stats ─────────────────────────────────────────
    public function getTotalCarbonSavedAttribute(): float
    {
        return $this->trips()
            ->where('status', 'completed')
            ->sum('carbon_saved');
    }

    public function getTotalTripsAttribute(): int
    {
        return $this->trips()
            ->where('status', 'completed')
            ->count();
    }
}
