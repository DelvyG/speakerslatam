<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\SpeakerStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\SpeakerDetailResource;
use App\Http\Resources\SpeakerListResource;
use App\Models\Speaker;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicSpeakerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Speaker::visibleInDirectory()
            ->with(['categories', 'topics', 'media']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('bio_short', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('categories', fn ($q) => $q->where('slug', $category));
        }

        if ($topic = $request->query('topic')) {
            $query->whereHas('topics', fn ($q) => $q->where('slug', $topic));
        }

        if ($city = $request->query('city')) {
            $query->where('city', $city);
        }

        if ($country = $request->query('country')) {
            $query->where('country', $country);
        }

        if ($language = $request->query('language')) {
            $query->whereHas('languages', fn ($q) => $q->where('code', $language));
        }

        if ($modality = $request->query('modality')) {
            $query->where('modality', $modality);
        }

        if ($request->query('is_featured')) {
            $query->featured();
        }

        $perPage = min((int) $request->query('per_page', 12), 50);

        $speakers = $query->latest()->paginate($perPage);

        return SpeakerListResource::collection($speakers);
    }

    public function show(string $slug): SpeakerDetailResource
    {
        $speaker = Speaker::visibleInDirectory()
            ->where('slug', $slug)
            ->with(['categories', 'topics', 'languages', 'media', 'activeMembership'])
            ->firstOrFail();

        return new SpeakerDetailResource($speaker);
    }

    public function featured(): AnonymousResourceCollection
    {
        $speakers = Speaker::visibleInDirectory()
            ->featured()
            ->with(['categories', 'topics', 'media'])
            ->limit(6)
            ->get();

        return SpeakerListResource::collection($speakers);
    }
}
