<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:255',
            'path' => 'required|string|max:2048',
            'referrer' => 'nullable|string|max:2048',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        $userAgent = $request->userAgent() ?? '';
        $deviceType = $this->detectDeviceType($userAgent);

        PageView::create([
            'session_id' => $validated['session_id'],
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent ?: null,
            'path' => $validated['path'],
            'referrer' => $validated['referrer'] ?? null,
            'device_type' => $deviceType,
            'duration_seconds' => $validated['duration_seconds'] ?? null,
        ]);

        return response()->json(['ok' => true], 201);
    }

    public function heartbeat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:255',
            'path' => 'required|string|max:2048',
            'duration_seconds' => 'required|integer|min:0',
        ]);

        $pageView = PageView::where('session_id', $validated['session_id'])
            ->where('path', $validated['path'])
            ->latest('created_at')
            ->first();

        if (!$pageView) {
            return response()->json(['ok' => false, 'message' => 'Page view not found'], 404);
        }

        $pageView->update([
            'duration_seconds' => $validated['duration_seconds'],
        ]);

        return response()->json(['ok' => true]);
    }

    private function detectDeviceType(string $userAgent): string
    {
        if (stripos($userAgent, 'Tablet') !== false || stripos($userAgent, 'iPad') !== false) {
            return 'tablet';
        }

        if (stripos($userAgent, 'Mobile') !== false || stripos($userAgent, 'Android') !== false) {
            return 'mobile';
        }

        return 'desktop';
    }
}
