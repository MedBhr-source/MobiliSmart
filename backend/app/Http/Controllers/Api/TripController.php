<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    /**
     * Get user's trips history.
     */
    public function index(Request $request): JsonResponse
    {
        $trips = $request->user()
            ->trips()
            ->with('route')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $trips,
        ]);
    }

    /**
     * Create a new trip.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'route_id' => ['required', 'exists:routes,id'],
            'modes_used' => ['sometimes', 'array'],
        ]);

        $trip = $request->user()->trips()->create([
            'route_id' => $validated['route_id'],
            'status' => Trip::STATUS_PLANNED,
            'modes_used' => $validated['modes_used'] ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trajet planifié',
            'data' => $trip->load('route'),
        ], 201);
    }

    /**
     * Update trip status.
     */
    public function update(Request $request, Trip $trip): JsonResponse
    {
        // Ensure trip belongs to authenticated user
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'status' => ['sometimes', 'in:active,completed,cancelled'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'feedback' => ['sometimes', 'string', 'max:500'],
        ]);

        if (isset($validated['status'])) {
            match ($validated['status']) {
                'active' => $trip->started_at = now(),
                'completed' => $this->completeTrip($trip),
                'cancelled' => null,
            };
            $trip->status = $validated['status'];
        }

        if (isset($validated['rating'])) {
            $trip->rating = $validated['rating'];
        }
        if (isset($validated['feedback'])) {
            $trip->feedback = $validated['feedback'];
        }

        $trip->save();

        return response()->json([
            'success' => true,
            'message' => 'Trajet mis à jour',
            'data' => $trip->fresh('route'),
        ]);
    }

    /**
     * Get trip statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $period = $request->query('period', 'month'); // week, month, year

        $daysMap = ['week' => 7, 'month' => 30, 'year' => 365];
        $days = $daysMap[$period] ?? 30;

        $trips = $user->trips()->completed()->recent($days);

        return response()->json([
            'success' => true,
            'data' => [
                'total_trips' => $trips->count(),
                'total_distance_km' => round($trips->join('routes', 'trips.route_id', '=', 'routes.id')->sum('routes.distance_meters') / 1000, 1),
                'total_carbon_saved_kg' => round($trips->sum('carbon_saved') / 1000, 2),
                'average_duration_min' => round($trips->avg('actual_duration_seconds') / 60, 0),
                'modes_breakdown' => $this->getModesBreakdown($user, $days),
                'period' => $period,
            ],
        ]);
    }

    private function completeTrip(Trip $trip): void
    {
        $trip->ended_at = now();
        if ($trip->started_at) {
            $trip->actual_duration_seconds = $trip->started_at->diffInSeconds($trip->ended_at);
        }

        // Calculate carbon saved vs car equivalent
        $route = $trip->route;
        if ($route) {
            $carCarbonGrams = $route->distance_meters * 0.12; // ~120g CO2/km for car
            $trip->carbon_saved = max(0, $carCarbonGrams - $route->carbon_grams);
        }
    }

    private function getModesBreakdown($user, int $days): array
    {
        return $user->trips()
            ->completed()
            ->recent($days)
            ->pluck('modes_used')
            ->flatten()
            ->countBy()
            ->sortDesc()
            ->toArray();
    }
}
