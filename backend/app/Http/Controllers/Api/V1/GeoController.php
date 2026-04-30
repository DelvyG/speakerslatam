<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeoController extends Controller
{
    public function countries(): JsonResponse
    {
        $countries = State::select('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country');

        return response()->json(['data' => $countries]);
    }

    public function states(Request $request): JsonResponse
    {
        $request->validate(['country' => 'required|string']);

        $states = State::where('country', $request->country)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $states]);
    }

    public function cities(Request $request): JsonResponse
    {
        $request->validate(['state_id' => 'required|integer|exists:states,id']);

        $cities = City::where('state_id', $request->state_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $cities]);
    }
}
