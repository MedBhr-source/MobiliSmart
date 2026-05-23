<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mobilismart API Routes
|--------------------------------------------------------------------------
*/

// ─── Public routes ─────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::get('/google', [\App\Http\Controllers\Api\AuthController::class, 'googleRedirect']);
    Route::get('/google/callback', [\App\Http\Controllers\Api\AuthController::class, 'googleCallback']);
});

// ─── Public data endpoints ─────────────────────────────
Route::get('/transit/lines', [\App\Http\Controllers\Api\TransitController::class, 'lines']);
Route::get('/transit/stops', [\App\Http\Controllers\Api\TransitController::class, 'stops']);
Route::get('/transit/stops/nearby', [\App\Http\Controllers\Api\TransitController::class, 'nearbyStops']);
Route::get('/transit/alerts', [\App\Http\Controllers\Api\TransitController::class, 'alerts']);

Route::get('/bikes/stations', [\App\Http\Controllers\Api\BikeController::class, 'stations']);
Route::get('/bikes/stations/nearby', [\App\Http\Controllers\Api\BikeController::class, 'nearbyStations']);

Route::get('/crowd/predict', [\App\Http\Controllers\Api\CrowdController::class, 'predict']);

Route::post('/routes/plan', [\App\Http\Controllers\Api\RouteController::class, 'plan']);

// ─── Protected routes (auth required) ──────────────────
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user/profile', [\App\Http\Controllers\Api\UserController::class, 'profile']);
    Route::put('/user/profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
    Route::put('/user/preferences', [\App\Http\Controllers\Api\UserController::class, 'updatePreferences']);

    // Auth
    Route::post('/auth/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);

    // Trips
    Route::get('/trips', [\App\Http\Controllers\Api\TripController::class, 'index']);
    Route::post('/trips', [\App\Http\Controllers\Api\TripController::class, 'store']);
    Route::put('/trips/{trip}', [\App\Http\Controllers\Api\TripController::class, 'update']);
    Route::get('/trips/stats', [\App\Http\Controllers\Api\TripController::class, 'stats']);

    // Saved routes
    Route::get('/routes/saved', [\App\Http\Controllers\Api\RouteController::class, 'saved']);
    Route::post('/routes/{route}/save', [\App\Http\Controllers\Api\RouteController::class, 'toggleSave']);

    // Carbon stats
    Route::get('/stats/carbon', [\App\Http\Controllers\Api\StatsController::class, 'carbon']);
    Route::get('/stats/dashboard', [\App\Http\Controllers\Api\StatsController::class, 'dashboard']);
});
