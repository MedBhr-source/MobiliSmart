<?php

namespace App\Services;

class CarbonCalculatorService
{
    // CO2 grams per km per mode
    private const EMISSIONS = [
        'walk' => 0,
        'bike' => 0,
        'metro' => 3,      // ~3g CO2/km/passenger
        'rer' => 4,
        'tram' => 3,
        'bus' => 68,        // ~68g CO2/km/passenger
        'train' => 6,
        'car' => 120,       // Reference: car solo
        'carpool' => 40,    // Car with 3 passengers
    ];

    /**
     * Calculate total CO2 emissions for a multimodal trip.
     */
    public function calculate(array $modes, float $totalDistanceMeters): int
    {
        $distanceKm = $totalDistanceMeters / 1000;
        $perModeKm = $distanceKm / max(count($modes), 1);

        $totalGrams = 0;
        foreach ($modes as $mode) {
            $emissionRate = self::EMISSIONS[$mode] ?? 50;
            $totalGrams += $perModeKm * $emissionRate;
        }

        return (int) round($totalGrams);
    }

    /**
     * Calculate carbon saved compared to car equivalent.
     */
    public function savedVsCar(array $modes, float $totalDistanceMeters): int
    {
        $carEmissions = ($totalDistanceMeters / 1000) * self::EMISSIONS['car'];
        $tripEmissions = $this->calculate($modes, $totalDistanceMeters);
        return (int) max(0, round($carEmissions - $tripEmissions));
    }
}
