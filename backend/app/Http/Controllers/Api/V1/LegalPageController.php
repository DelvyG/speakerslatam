<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\JsonResponse;

class LegalPageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = LegalPage::where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => [
                'slug' => $page->slug,
                'title' => $page->title,
                'content' => $page->content,
                'updated_at' => $page->updated_at->toIso8601String(),
            ],
        ]);
    }
}
