<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Speaker;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_speakers' => Speaker::active()->count(),
                'total_categories' => Category::count(),
                'total_countries' => Speaker::active()->distinct('country')->count('country'),
                'total_topics' => Topic::count(),
            ],
        ]);
    }
}
