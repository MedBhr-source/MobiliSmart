<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'stats' => [
                    'total_trips' => $user->total_trips,
                    'carbon_saved' => $user->total_carbon_saved,
                    'favorite_mode' => $this->getFavoriteMode($user),
                ],
            ],
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            'avatar' => ['sometimes', 'string', 'url'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour',
            'data' => ['user' => $request->user()->fresh()],
        ]);
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mode_priority' => ['sometimes', 'in:balanced,eco,fast,cheap'],
            'avoid_modes' => ['sometimes', 'array'],
            'avoid_modes.*' => ['string', 'in:metro,bus,tram,bike,walk,carpool'],
            'max_walking_minutes' => ['sometimes', 'integer', 'min:5', 'max:30'],
            'accessibility' => ['sometimes', 'boolean'],
            'notifications' => ['sometimes', 'boolean'],
            'dark_mode' => ['sometimes', 'boolean'],
            'language' => ['sometimes', 'in:fr,en'],
        ]);

        $user = $request->user();
        $currentPrefs = $user->preferences;
        $user->preferences = array_merge($currentPrefs, $validated);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Préférences mises à jour',
            'data' => ['preferences' => $user->preferences],
        ]);
    }

    private function getFavoriteMode($user): ?string
    {
        $modes = $user->trips()
            ->completed()
            ->pluck('modes_used')
            ->flatten()
            ->countBy()
            ->sortDesc();

        return $modes->keys()->first();
    }
}
