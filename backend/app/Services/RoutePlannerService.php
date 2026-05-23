<?php

namespace App\Services;

use App\Models\Route;
use App\Models\TransitStop;
use App\Models\BikeStation;
use Illuminate\Support\Facades\Http;

class RoutePlannerService
{
    private CarbonCalculatorService $carbonCalc;

    public function __construct(CarbonCalculatorService $carbonCalc)
    {
        $this->carbonCalc = $carbonCalc;
    }

    /**
     * Plan multimodal routes between origin and destination.
     * Returns up to 3 route options: fastest, eco-friendly, cheapest.
     */
    public function planRoutes(array $params): array
    {
        $originLat = $params['origin_lat'];
        $originLng = $params['origin_lng'];
        $destLat = $params['destination_lat'];
        $destLng = $params['destination_lng'];

        $distance = $this->haversineDistance($originLat, $originLng, $destLat, $destLng);
        $nearbyStops = TransitStop::nearby($originLat, $originLng, 0.8)->limit(5)->get();
        $nearbyBikes = BikeStation::nearby($originLat, $originLng, 0.5)->withBikes()->limit(3)->get();

        $routes = [];

        // Option 1: Transit (fastest)
        $routes[] = $this->buildTransitRoute($params, $distance, $nearbyStops);

        // Option 2: Eco (walk + bike + transit)
        if ($nearbyBikes->isNotEmpty()) {
            $routes[] = $this->buildEcoRoute($params, $distance, $nearbyStops, $nearbyBikes);
        }

        // Option 3: Walking (if distance < 3km)
        if ($distance < 3000) {
            $routes[] = $this->buildWalkingRoute($params, $distance);
        }

        // Option 4: Bike only (if distance < 8km)
        if ($distance < 8000 && $nearbyBikes->isNotEmpty()) {
            $routes[] = $this->buildBikeRoute($params, $distance, $nearbyBikes);
        }

        // Sort by priority
        $priority = $params['mode_priority'] ?? 'balanced';
        $routes = $this->sortByPriority($routes, $priority);

        // Save routes to DB and return
        return array_map(function ($routeData) {
            $route = Route::create($routeData);
            $route->duration_formatted = $route->duration_formatted;
            $route->distance_formatted = $route->distance_formatted;
            $route->carbon_formatted = $route->carbon_formatted;
            return $route;
        }, array_slice($routes, 0, 3));
    }

    private function buildTransitRoute(array $params, float $distance, $nearbyStops): array
    {
        $walkToStop = min(600, rand(180, 480));
        $transitTime = (int)($distance / 8.33); // ~30 km/h average
        $walkFromStop = min(600, rand(120, 420));
        $totalDuration = $walkToStop + $transitTime + $walkFromStop;

        $modes = ['walk', 'tram', 'walk'];
        if ($distance > 5000) $modes = ['walk', 'tram', 'bus', 'walk'];

        $stopNames = $nearbyStops->pluck('name')->take(3)->toArray();

        return [
            'origin_name' => $params['origin_name'] ?? 'Départ',
            'origin_lat' => $params['origin_lat'],
            'origin_lng' => $params['origin_lng'],
            'destination_name' => $params['destination_name'] ?? 'Arrivée',
            'destination_lat' => $params['destination_lat'],
            'destination_lng' => $params['destination_lng'],
            'distance_meters' => (int)$distance,
            'duration_seconds' => $totalDuration,
            'carbon_grams' => $this->carbonCalc->calculate($modes, $distance),
            'cost_cents' => 600, // Ticket tramway Casa (6 DH)
            'modes' => $modes,
            'steps' => [
                ['mode' => 'walk', 'duration' => $walkToStop, 'instruction' => 'Marcher jusqu\'à ' . ($stopNames[0] ?? 'l\'arrêt')],
                ['mode' => 'tram', 'duration' => $transitTime, 'instruction' => 'Prendre le tramway', 'line' => $stopNames[1] ?? null],
                ['mode' => 'walk', 'duration' => $walkFromStop, 'instruction' => 'Marcher jusqu\'à destination'],
            ],
        ];
    }

    private function buildEcoRoute(array $params, float $distance, $nearbyStops, $nearbyBikes): array
    {
        $walkToBike = rand(120, 300);
        $bikeTime = (int)(min($distance * 0.4, 3000) / 4.17); // ~15 km/h
        $transitTime = (int)(($distance * 0.5) / 8.33);
        $walkEnd = rand(60, 240);
        $totalDuration = $walkToBike + $bikeTime + $transitTime + $walkEnd;

        $modes = ['walk', 'bike', 'tram', 'walk'];

        return [
            'origin_name' => $params['origin_name'] ?? 'Départ',
            'origin_lat' => $params['origin_lat'],
            'origin_lng' => $params['origin_lng'],
            'destination_name' => $params['destination_name'] ?? 'Arrivée',
            'destination_lat' => $params['destination_lat'],
            'destination_lng' => $params['destination_lng'],
            'distance_meters' => (int)$distance,
            'duration_seconds' => $totalDuration,
            'carbon_grams' => $this->carbonCalc->calculate($modes, $distance),
            'cost_cents' => 600, // 6 DH
            'modes' => $modes,
            'steps' => [
                ['mode' => 'walk', 'duration' => $walkToBike, 'instruction' => 'Marcher jusqu\'à la station vélo ' . $nearbyBikes->first()->name],
                ['mode' => 'bike', 'duration' => $bikeTime, 'instruction' => 'Vélo jusqu\'à la station de métro'],
                ['mode' => 'tram', 'duration' => $transitTime, 'instruction' => 'Prendre le tramway'],
                ['mode' => 'walk', 'duration' => $walkEnd, 'instruction' => 'Marcher jusqu\'à destination'],
            ],
        ];
    }

    private function buildWalkingRoute(array $params, float $distance): array
    {
        $duration = (int)($distance / 1.39); // ~5 km/h

        return [
            'origin_name' => $params['origin_name'] ?? 'Départ',
            'origin_lat' => $params['origin_lat'],
            'origin_lng' => $params['origin_lng'],
            'destination_name' => $params['destination_name'] ?? 'Arrivée',
            'destination_lat' => $params['destination_lat'],
            'destination_lng' => $params['destination_lng'],
            'distance_meters' => (int)$distance,
            'duration_seconds' => $duration,
            'carbon_grams' => 0,
            'cost_cents' => 0,
            'modes' => ['walk'],
            'steps' => [
                ['mode' => 'walk', 'duration' => $duration, 'instruction' => 'Marcher jusqu\'à destination'],
            ],
        ];
    }

    private function buildBikeRoute(array $params, float $distance, $nearbyBikes): array
    {
        $walkToBike = rand(60, 240);
        $bikeTime = (int)($distance / 4.17);
        $walkEnd = rand(60, 180);

        return [
            'origin_name' => $params['origin_name'] ?? 'Départ',
            'origin_lat' => $params['origin_lat'],
            'origin_lng' => $params['origin_lng'],
            'destination_name' => $params['destination_name'] ?? 'Arrivée',
            'destination_lat' => $params['destination_lat'],
            'destination_lng' => $params['destination_lng'],
            'distance_meters' => (int)$distance,
            'duration_seconds' => $walkToBike + $bikeTime + $walkEnd,
            'carbon_grams' => 0,
            'cost_cents' => 300, // 3 DH vélo
            'modes' => ['walk', 'bike', 'walk'],
            'steps' => [
                ['mode' => 'walk', 'duration' => $walkToBike, 'instruction' => 'Marcher jusqu\'à ' . $nearbyBikes->first()->name],
                ['mode' => 'bike', 'duration' => $bikeTime, 'instruction' => 'Pédaler jusqu\'à destination'],
                ['mode' => 'walk', 'duration' => $walkEnd, 'instruction' => 'Marcher jusqu\'à destination'],
            ],
        ];
    }

    private function sortByPriority(array $routes, string $priority): array
    {
        usort($routes, function ($a, $b) use ($priority) {
            return match ($priority) {
                'fast' => $a['duration_seconds'] <=> $b['duration_seconds'],
                'eco' => $a['carbon_grams'] <=> $b['carbon_grams'],
                'cheap' => $a['cost_cents'] <=> $b['cost_cents'],
                default => $a['duration_seconds'] <=> $b['duration_seconds'],
            };
        });
        return $routes;
    }

    private function haversineDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}
