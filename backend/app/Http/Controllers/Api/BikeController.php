<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BikeStation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BikeController extends Controller
{
    /**
     * Get all bike stations (cached 2 min).
     */
    public function stations(Request $request): JsonResponse
    {
        $stations = Cache::remember('bike_stations_all', 120, function () {
            return BikeStation::active()
                ->orderBy('name')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $stations,
        ]);
    }

    /**
     * Get nearby bike stations with availability.
     */
    public function nearbyStations(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius' => ['sometimes', 'numeric', 'min:0.1', 'max:5'],
            'with_bikes' => ['sometimes', 'boolean'],
        ]);

        $query = BikeStation::active()
            ->nearby(
                $validated['lat'],
                $validated['lng'],
                $validated['radius'] ?? 1.0
            );

        if ($request->boolean('with_bikes', false)) {
            $query->withBikes();
        }

        $stations = $query->limit(15)->get();

        return response()->json([
            'success' => true,
            'data' => $stations,
        ]);
    }
}
