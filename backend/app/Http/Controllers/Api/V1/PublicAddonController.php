<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddonResource;
use App\Models\Addon;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicAddonController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $addons = Addon::where('is_active', true)
            ->orderBy('order')
            ->get();

        return AddonResource::collection($addons);
    }
}
