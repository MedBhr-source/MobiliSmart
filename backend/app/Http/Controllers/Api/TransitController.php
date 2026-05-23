<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransitLine;
use App\Models\TransitStop;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TransitController extends Controller
{
    /**
     * Get all transit lines (cached 5 min).
     */
    public function lines(Request $request): JsonResponse
    {
        $type = $request->query('type'); // metro, bus, tram, rer

        $cacheKey = 'transit_lines_' . ($type ?: 'all');

        $lines = Cache::remember($cacheKey, 300, function () use ($type) {
            $query = TransitLine::active()->withCount('stops');

            if ($type) {
                $query->byType($type);
            }

            return $query->orderBy('type')->orderBy('short_name')->get();
        });

        return response()->json([
            'success' => true,
            'data' => $lines,
        ]);
    }

    /**
     * Get all transit stops (with optional line filter).
     */
    public function stops(Request $request): JsonResponse
    {
        $lineId = $request->query('line_id');

        $query = TransitStop::with('lines:id,short_name,color,type');

        if ($lineId) {
            $query->whereHas('lines', fn($q) => $q->where('transit_lines.id', $lineId));
        }

        $stops = $query->get();

        return response()->json([
            'success' => true,
            'data' => $stops,
        ]);
    }

    /**
     * Get nearby stops using Haversine.
     */
    public function nearbyStops(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius' => ['sometimes', 'numeric', 'min:0.1', 'max:5'],
        ]);

        $stops = TransitStop::nearby(
            $validated['lat'],
            $validated['lng'],
            $validated['radius'] ?? 1.0
        )
            ->with('lines:id,short_name,color,type')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stops,
        ]);
    }

    /**
     * Get active alerts.
     */
    public function alerts(Request $request): JsonResponse
    {
        $lineId = $request->query('line_id');
        $severity = $request->query('severity');

        $query = Alert::active()->with('line:id,short_name,color,type');

        if ($lineId) {
            $query->where('line_id', $lineId);
        }
        if ($severity) {
            $query->bySeverity($severity);
        }

        $alerts = $query->orderByRaw("FIELD(severity, 'critical', 'high', 'medium', 'low')")
            ->get();

        return response()->json([
            'success' => true,
            'data' => $alerts,
        ]);
    }
}
