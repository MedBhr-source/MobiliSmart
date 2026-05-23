<?php

return [
    'server' => env('OCTANE_SERVER', 'swoole'),
    'https' => env('OCTANE_HTTPS', false),
    'listeners' => [],
    'warm' => [],
    'flush' => [],
    'garbage' => 50,
    'max_execution_time' => 30,
    'state_file' => storage_path('logs/octane-state.json'),
    'tables' => [],
    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],
];
