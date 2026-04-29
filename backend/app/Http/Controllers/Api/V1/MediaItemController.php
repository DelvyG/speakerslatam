<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Http\JsonResponse;

class MediaItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = MediaItem::with('media')
            ->latest()
            ->paginate(50);

        $data = $items->map(function (MediaItem $item) {
            $media = $item->getFirstMedia('default');
            return [
                'id' => $item->id,
                'title' => $item->title,
                'alt_text' => $item->alt_text,
                'description' => $item->description,
                'url' => $media?->getUrl(),
                'thumb_url' => $media?->getUrl('thumb'),
                'preview_url' => $media?->getUrl('preview'),
                'mime_type' => $media?->mime_type,
                'size' => $media?->size,
                'file_name' => $media?->file_name,
                'created_at' => $item->created_at->toIso8601String(),
            ];
        });

        return response()->json(['data' => $data]);
    }
}
