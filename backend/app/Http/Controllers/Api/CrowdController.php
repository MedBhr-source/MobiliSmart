<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CrowdPredictionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrowdController extends Controller
{
    public function __construct(
        private CrowdPredictionService $predictionService,
    ) {}

    public function predict(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stop_id' => ['sometimes', 'exists:transit_stops,id'],
            'line_id' => ['sometimes', 'exists:transit_lines,id'],
            'datetime' => ['sometimes', 'date'],
        ]);

        $predictions = $this->predictionService->getPredictions(
            stopId: $validated['stop_id'] ?? null,
            lineId: $validated['line_id'] ?? null,
            dateTime: isset($validated['datetime'])
                ? \Carbon\Carbon::parse($validated['datetime'])
                : now(),
        );

        return response()->json([
            'success' => true,
            'data' => $predictions,
        ]);
    }
}
