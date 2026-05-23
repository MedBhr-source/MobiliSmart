<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUsers();
        $this->seedTransitLines();
        $this->seedTransitStops();
        $this->seedBikeStations();
        $this->seedAlerts();
        $this->seedCrowdPredictions();
    }

    private function seedUsers(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Demo User',
                'email' => 'demo@mobilismart.app',
                'password' => Hash::make('password'),
                'preferences' => json_encode([
                    'mode_priority' => 'eco',
                    'avoid_modes' => [],
                    'max_walking_minutes' => 15,
                    'notifications' => true,
                    'dark_mode' => true,
                    'language' => 'fr',
                ]),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    private function seedTransitLines(): void
    {
        $lines = [
            // Tramway lines (Casablanca)
            ['name' => 'Tramway T1', 'short_name' => 'T1', 'type' => 'tram', 'color' => '#E2231A', 'text_color' => '#FFFFFF', 'operator' => 'Casa Transport'],
            ['name' => 'Tramway T2', 'short_name' => 'T2', 'type' => 'tram', 'color' => '#007DC5', 'text_color' => '#FFFFFF', 'operator' => 'Casa Transport'],
            ['name' => 'Tramway T3', 'short_name' => 'T3', 'type' => 'tram', 'color' => '#62259D', 'text_color' => '#FFFFFF', 'operator' => 'Casa Transport'],
            ['name' => 'Tramway T4', 'short_name' => 'T4', 'type' => 'tram', 'color' => '#FF7E2E', 'text_color' => '#000000', 'operator' => 'Casa Transport'],
            // Train lines (ONCF)
            ['name' => 'Al Boraq (TGV)', 'short_name' => 'AB', 'type' => 'train', 'color' => '#C60C30', 'text_color' => '#FFFFFF', 'operator' => 'ONCF'],
            ['name' => 'Train Casa-Rabat', 'short_name' => 'TNR', 'type' => 'train', 'color' => '#1D4289', 'text_color' => '#FFFFFF', 'operator' => 'ONCF'],
            ['name' => 'Train Casa-Marrakech', 'short_name' => 'TNM', 'type' => 'train', 'color' => '#006DB8', 'text_color' => '#FFFFFF', 'operator' => 'ONCF'],
            ['name' => 'Train Casa-El Jadida', 'short_name' => 'TNJ', 'type' => 'train', 'color' => '#007852', 'text_color' => '#FFFFFF', 'operator' => 'ONCF'],
            // Bus lines (Alsa / Casa Bus)
            ['name' => 'Bus L33', 'short_name' => '33', 'type' => 'bus', 'color' => '#00A85A', 'text_color' => '#FFFFFF', 'operator' => 'Alsa'],
            ['name' => 'Bus L35', 'short_name' => '35', 'type' => 'bus', 'color' => '#00A85A', 'text_color' => '#FFFFFF', 'operator' => 'Alsa'],
            ['name' => 'Bus L90', 'short_name' => '90', 'type' => 'bus', 'color' => '#00A85A', 'text_color' => '#FFFFFF', 'operator' => 'Alsa'],
            ['name' => 'Bus L10', 'short_name' => '10', 'type' => 'bus', 'color' => '#00A85A', 'text_color' => '#FFFFFF', 'operator' => 'Alsa'],
            ['name' => 'Bus L21', 'short_name' => '21', 'type' => 'bus', 'color' => '#00A85A', 'text_color' => '#FFFFFF', 'operator' => 'Alsa'],
        ];

        foreach ($lines as $line) {
            DB::table('transit_lines')->insert(array_merge($line, [
                'external_id' => 'line_' . strtolower($line['short_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    private function seedTransitStops(): void
    {
        $stops = [
            // Major stops (Casablanca coordinates)
            ['name' => 'Casa-Voyageurs', 'lat' => 33.5892, 'lng' => -7.5891, 'type' => 'train', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Casa-Port', 'lat' => 33.6025, 'lng' => -7.6145, 'type' => 'train', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Place Mohammed V', 'lat' => 33.5893, 'lng' => -7.6149, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Bd Zerktouni', 'lat' => 33.5878, 'lng' => -7.6283, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Maarif', 'lat' => 33.5819, 'lng' => -7.6361, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Ain Diab', 'lat' => 33.5931, 'lng' => -7.6704, 'type' => 'tram', 'accessibility' => true, 'zone' => '2'],
            ['name' => 'Hay Hassani', 'lat' => 33.5620, 'lng' => -7.6720, 'type' => 'bus', 'accessibility' => true, 'zone' => '2'],
            ['name' => 'Sidi Moumen', 'lat' => 33.5712, 'lng' => -7.5350, 'type' => 'tram', 'accessibility' => true, 'zone' => '2'],
            ['name' => 'Sidi Bernoussi', 'lat' => 33.6070, 'lng' => -7.5310, 'type' => 'tram', 'accessibility' => true, 'zone' => '2'],
            ['name' => 'Ain Sebaa', 'lat' => 33.6120, 'lng' => -7.5550, 'type' => 'bus', 'accessibility' => true, 'zone' => '2'],
            ['name' => 'Derb Sultan', 'lat' => 33.5800, 'lng' => -7.6050, 'type' => 'bus', 'accessibility' => false, 'zone' => '1'],
            ['name' => 'Habous', 'lat' => 33.5800, 'lng' => -7.6000, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Ancienne Médina', 'lat' => 33.6000, 'lng' => -7.6180, 'type' => 'bus', 'accessibility' => false, 'zone' => '1'],
            ['name' => 'Mosquée Hassan II', 'lat' => 33.6087, 'lng' => -7.6329, 'type' => 'bus', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Lissasfa', 'lat' => 33.5430, 'lng' => -7.6690, 'type' => 'tram', 'accessibility' => true, 'zone' => '3'],
            ['name' => 'Bouskoura', 'lat' => 33.4900, 'lng' => -7.6300, 'type' => 'bus', 'accessibility' => false, 'zone' => '3'],
            ['name' => 'Aéroport Mohammed V', 'lat' => 33.3675, 'lng' => -7.5899, 'type' => 'train', 'accessibility' => true, 'zone' => '4'],
            ['name' => 'Oasis', 'lat' => 33.5650, 'lng' => -7.6400, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Bd Abdelmoumen', 'lat' => 33.5830, 'lng' => -7.6200, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
            ['name' => 'Anfa', 'lat' => 33.5750, 'lng' => -7.6450, 'type' => 'tram', 'accessibility' => true, 'zone' => '1'],
        ];

        foreach ($stops as $i => $stop) {
            DB::table('transit_stops')->insert(array_merge($stop, [
                'external_id' => 'stop_' . ($i + 1),
                'has_shelter' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Link stops to lines (simplified)
        $lineStopMappings = [
            1 => [3, 4, 5, 8, 11, 12, 15],  // Tramway T1
            2 => [3, 4, 6, 9, 10, 19],       // Tramway T2
            3 => [7, 9, 18, 20],              // Tramway T3
            4 => [3, 5, 8, 15],               // Tramway T4
            5 => [1, 2],                       // Al Boraq
            6 => [1, 2],                       // Train Casa-Rabat
            7 => [1],                          // Train Casa-Marrakech
            9 => [7, 10, 11],                  // Bus L33
            10 => [4, 11, 6],                  // Bus L35
            11 => [1, 17],                     // Bus L90
        ];

        foreach ($lineStopMappings as $lineId => $stopIds) {
            foreach ($stopIds as $order => $stopId) {
                DB::table('line_stop')->insert([
                    'transit_line_id' => $lineId,
                    'transit_stop_id' => $stopId,
                    'order' => $order,
                    'direction' => 'aller',
                ]);
            }
        }
    }

    private function seedBikeStations(): void
    {
        $stations = [
            ['name' => 'Corniche Ain Diab', 'lat' => 33.5935, 'lng' => -7.6700, 'capacity' => 40, 'available_bikes' => 15, 'available_docks' => 25],
            ['name' => 'Place Mohammed V', 'lat' => 33.5895, 'lng' => -7.6150, 'capacity' => 30, 'available_bikes' => 8, 'available_docks' => 22],
            ['name' => 'Gare Casa-Voyageurs', 'lat' => 33.5890, 'lng' => -7.5895, 'capacity' => 50, 'available_bikes' => 22, 'available_docks' => 28],
            ['name' => 'Morocco Mall', 'lat' => 33.5731, 'lng' => -7.6609, 'capacity' => 35, 'available_bikes' => 18, 'available_docks' => 17],
            ['name' => 'Habous - Quartier des Habous', 'lat' => 33.5800, 'lng' => -7.6005, 'capacity' => 25, 'available_bikes' => 10, 'available_docks' => 15],
            ['name' => 'Mosquée Hassan II', 'lat' => 33.6087, 'lng' => -7.6329, 'capacity' => 45, 'available_bikes' => 25, 'available_docks' => 20],
            ['name' => 'Maarif', 'lat' => 33.5820, 'lng' => -7.6360, 'capacity' => 30, 'available_bikes' => 12, 'available_docks' => 18],
            ['name' => 'Anfa Place', 'lat' => 33.5750, 'lng' => -7.6450, 'capacity' => 35, 'available_bikes' => 20, 'available_docks' => 15],
            ['name' => 'Bd Zerktouni', 'lat' => 33.5880, 'lng' => -7.6280, 'capacity' => 25, 'available_bikes' => 6, 'available_docks' => 19],
            ['name' => 'Casa-Port', 'lat' => 33.6020, 'lng' => -7.6140, 'capacity' => 40, 'available_bikes' => 30, 'available_docks' => 10],
        ];

        foreach ($stations as $i => $station) {
            DB::table('bike_stations')->insert(array_merge($station, [
                'external_id' => 'bike_' . ($i + 1),
                'has_electric' => rand(0, 1),
                'is_active' => true,
                'last_synced_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    private function seedAlerts(): void
    {
        DB::table('alerts')->insert([
            [
                'line_id' => 1, // Tramway T1
                'type' => 'disruption',
                'severity' => 'high',
                'title' => 'Interruption Tramway T1',
                'message' => 'Trafic interrompu entre Sidi Moumen et Hay Hassani suite à un incident technique. Bus de remplacement en service.',
                'active_from' => now()->subHours(2),
                'active_until' => now()->addHours(1),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'line_id' => 10, // Bus L35
                'type' => 'delay',
                'severity' => 'medium',
                'title' => 'Ralentissement Bus L35',
                'message' => 'Embouteillage sur Bd Zerktouni. Temps d\'attente estimé : +10 minutes.',
                'active_from' => now()->subHours(1),
                'active_until' => now()->addHours(2),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'line_id' => 2, // Tramway T2
                'type' => 'info',
                'severity' => 'low',
                'title' => 'Tramway T2 - Service normal',
                'message' => 'Le trafic est normal sur l\'ensemble de la ligne Ain Diab – Sidi Bernoussi.',
                'active_from' => now(),
                'active_until' => now()->addHours(12),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    private function seedCrowdPredictions(): void
    {
        $predictions = [];
        $stops = DB::table('transit_stops')->pluck('id');
        $lines = DB::table('transit_lines')->where('type', 'tram')->pluck('id');

        // Generate predictions for weekdays, peak hours
        foreach ($lines->take(4) as $lineId) {
            foreach ($stops->take(10) as $stopId) {
                foreach ([1, 2, 3, 4, 5] as $day) { // Mon-Fri
                    foreach ([7, 8, 9, 17, 18, 19] as $hour) { // Peak hours
                        $level = match(true) {
                            in_array($hour, [8, 9, 18]) => rand(4, 5),
                            in_array($hour, [7, 17, 19]) => rand(3, 4),
                            default => rand(1, 3),
                        };

                        $predictions[] = [
                            'stop_id' => $stopId,
                            'line_id' => $lineId,
                            'predicted_level' => $level,
                            'confidence' => round(rand(70, 95) / 100, 4),
                            'predicted_for' => now()->next($day)->setHour($hour),
                            'day_of_week' => $day,
                            'hour' => $hour,
                            'model_version' => 'v1.0',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }

        // Insert in chunks
        foreach (array_chunk($predictions, 100) as $chunk) {
            DB::table('crowd_predictions')->insert($chunk);
        }
    }
}
