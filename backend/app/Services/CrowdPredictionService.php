<?php

namespace App\Services;

use App\Models\CrowdPrediction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CrowdPredictionService
{
    /**
     * Get crowd predictions, first checking DB, then calling AI service.
     */
    public function getPredictions(?int $stopId, ?int $lineId, Carbon $dateTime): array
    {
        $cacheKey = "crowd_{$stopId}_{$lineId}_{$dateTime->dayOfWeek}_{$dateTime->hour}";

        return Cache::remember($cacheKey, 300, function () use ($stopId, $lineId, $dateTime) {
            // Try database first
            $query = CrowdPrediction::query()
                ->forTime($dateTime)
                ->highConfidence();

            if ($stopId) $query->where('stop_id', $stopId);
            if ($lineId) $query->where('line_id', $lineId);

            $dbPredictions = $query->with(['stop:id,name', 'line:id,short_name,color'])
                ->orderByDesc('confidence')
                ->limit(20)
                ->get();

            if ($dbPredictions->isNotEmpty()) {
                return [
                    'predictions' => $dbPredictions,
                    'source' => 'database',
                    'requested_at' => now()->toIso8601String(),
                ];
            }

            // Fallback: call AI microservice
            return $this->callAIService($stopId, $lineId, $dateTime);
        });
    }

    private function callAIService(?int $stopId, ?int $lineId, Carbon $dateTime): array
    {
        try {
            $response = Http::timeout(10)
                ->post(config('app.ai_service_url', 'http://ai-service:8001') . '/predict/crowd', [
                    'stop_id' => $stopId,
                    'line_id' => $lineId,
                    'day_of_week' => $dateTime->dayOfWeek,
                    'hour' => $dateTime->hour,
                    'month' => $dateTime->month,
                ]);

            if ($response->successful()) {
                return [
                    'predictions' => $response->json('predictions', []),
                    'source' => 'ai_model',
                    'model_version' => $response->json('model_version', 'v1.0'),
                    'requested_at' => now()->toIso8601String(),
                ];
            }
        } catch (\Exception $e) {
            // AI service unavailable - return fallback
        }

        return $this->getFallbackPrediction($dateTime);
    }

    private function getFallbackPrediction(Carbon $dateTime): array
    {
        $hour = $dateTime->hour;
        $isWeekday = $dateTime->isWeekday();

        $level = match (true) {
            $isWeekday && in_array($hour, [8, 9, 18]) => 5,
            $isWeekday && in_array($hour, [7, 17, 19]) => 4,
            $isWeekday && $hour >= 10 && $hour <= 16 => 2,
            !$isWeekday && $hour >= 14 && $hour <= 18 => 3,
            default => 1,
        };

        return [
            'predictions' => [[
                'predicted_level' => $level,
                'confidence' => 0.5,
                'label' => CrowdPrediction::levelLabels()[$level],
            ]],
            'source' => 'fallback',
            'requested_at' => now()->toIso8601String(),
        ];
    }
}
