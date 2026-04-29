<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicTopicController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $topics = Topic::with('category')->get();

        return TopicResource::collection($topics);
    }
}
