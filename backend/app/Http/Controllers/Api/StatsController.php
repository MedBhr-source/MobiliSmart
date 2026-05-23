<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function carbon(Request $request): JsonResponse
    {
        $user = $request->user();
        $trips = $user->trips()->completed();

        $totalCarbonSaved = $trips->sum('carbon_saved');
        $treesEquivalent = round($totalCarbonSaved / 21000, 1);

        return response()->json([
            'success' => true,
            'data' => [
                'total_carbon_saved_grams' => $totalCarbonSaved,
                'total_carbon_saved_kg' => round($totalCarbonSaved / 1000, 2),
                'trees_equivalent' => $treesEquivalent,
                'car_km_avoided' => round($totalCarbonSaved / 120, 1),
            ],
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $recentTrips = $user->trips()
            ->with('route')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $monthTrips = $user->trips()->completed()->recent(30);
        $weekTrips = $user->trips()->completed()->recent(7);

        return response()->json([
            'success' => true,
            'data' => [
                'recent_trips' => $recentTrips,
                'month_stats' => [
                    'trips' => $monthTrips->count(),
                    'carbon_saved_kg' => round($monthTrips->sum('carbon_saved') / 1000, 2),
                    'distance_km' => round($monthTrips->join('routes', 'trips.route_id', '=', 'routes.id')->sum('routes.distance_meters') / 1000, 1),
                ],
                'week_stats' => [
                    'trips' => $weekTrips->count(),
                    'carbon_saved_kg' => round($weekTrips->sum('carbon_saved') / 1000, 2),
                ],
                'preferences' => $user->preferences,
            ],
        ]);
    }
}
