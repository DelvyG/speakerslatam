<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddonResource;
use App\Http\Resources\MembershipResource;
use App\Models\Addon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SpeakerMembershipController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $membership = $speaker->activeMembership;

        if (! $membership) {
            return response()->json([
                'data' => null,
                'message' => 'No tienes una membresía activa.',
            ]);
        }

        return response()->json([
            'data' => new MembershipResource($membership),
        ]);
    }

    public function addons(Request $request): JsonResponse
    {
        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $purchasedAddonIds = $speaker->addonPurchases()
            ->where('status', 'active')
            ->pluck('addon_id')
            ->toArray();

        $addons = Addon::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($addon) use ($purchasedAddonIds) {
                $resource = (new AddonResource($addon))->resolve();
                $resource['is_purchased'] = in_array($addon->id, $purchasedAddonIds);
                return $resource;
            });

        return response()->json([
            'data' => $addons,
        ]);
    }
}
