<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Services\RoutePlannerService;
use App\Services\CarbonCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function __construct(
        private RoutePlannerService $routePlanner,
        private CarbonCalculatorService $carbonCalculator,
    ) {}

    /**
     * Plan a multimodal route.
     */
    public function plan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'origin_lat' => ['required', 'numeric', 'between:-90,90'],
            'origin_lng' => ['required', 'numeric', 'between:-180,180'],
            'origin_name' => ['sometimes', 'string', 'max:255'],
            'destination_lat' => ['required', 'numeric', 'between:-90,90'],
            'destination_lng' => ['required', 'numeric', 'between:-180,180'],
            'destination_name' => ['sometimes', 'string', 'max:255'],
            'mode_priority' => ['sometimes', 'in:balanced,eco,fast,cheap'],
            'avoid_modes' => ['sometimes', 'array'],
            'departure_time' => ['sometimes', 'date'],
        ]);

        $routes = $this->routePlanner->planRoutes($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'routes' => $routes,
                'meta' => [
                    'origin' => $validated['origin_name'] ?? 'Position actuelle',
                    'destination' => $validated['destination_name'] ?? 'Destination',
                    'planned_at' => now()->toIso8601String(),
                ],
            ],
        ]);
    }

    /**
     * Get user's saved routes.
     */
    public function saved(Request $request): JsonResponse
    {
        $routes = $request->user()
            ->savedRoutes()
            ->orderByDesc('saved_routes.created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $routes,
        ]);
    }

    /**
     * Toggle save/unsave a route.
     */
    public function toggleSave(Request $request, Route $route): JsonResponse
    {
        $user = $request->user();

        if ($user->savedRoutes()->where('route_id', $route->id)->exists()) {
            $user->savedRoutes()->detach($route->id);
            $message = 'Itinéraire retiré des favoris';
            $saved = false;
        } else {
            $user->savedRoutes()->attach($route->id);
            $message = 'Itinéraire ajouté aux favoris';
            $saved = true;
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => ['saved' => $saved],
        ]);
    }
}
