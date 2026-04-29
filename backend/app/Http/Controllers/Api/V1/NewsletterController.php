<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    public function store(SubscribeNewsletterRequest $request): JsonResponse
    {
        NewsletterSubscriber::create([
            ...$request->validated(),
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Suscripción exitosa. ¡Gracias por unirte!',
        ], 201);
    }
}
