<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\PaymentAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MembershipController extends Controller
{
    public function plans(): JsonResponse
    {
        $plans = MembershipPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'price', 'currency', 'duration_days', 'features']);

        return response()->json(['data' => $plans]);
    }

    public function paymentAccounts(): JsonResponse
    {
        $accounts = PaymentAccount::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'type', 'details', 'instructions']);

        return response()->json(['data' => $accounts]);
    }

    public function myMembership(Request $request): JsonResponse
    {
        $speaker = $request->user()->speaker;

        if (!$speaker) {
            return response()->json(['data' => null]);
        }

        $membership = $speaker->memberships()
            ->with('plan')
            ->latest()
            ->first();

        if (!$membership) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => [
            'id' => $membership->id,
            'plan_name' => $membership->plan?->name,
            'amount_paid' => $membership->amount_paid,
            'status' => $membership->status->value,
            'status_label' => $membership->status->getLabel(),
            'starts_at' => $membership->starts_at?->toIso8601String(),
            'expires_at' => $membership->expires_at?->toIso8601String(),
            'payment_platform' => $membership->payment_platform,
            'payment_reference' => $membership->payment_reference,
            'has_proof' => !empty($membership->proof_file),
        ]]);
    }

    public function submitPayment(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => ['required', 'exists:membership_plans,id'],
            'payment_platform' => ['required', 'string', 'max:100'],
            'payment_reference' => ['required', 'string', 'max:255'],
            'payment_date' => ['required', 'date'],
            'proof' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:10240'],
        ], [
            'plan_id.required' => 'Selecciona un plan.',
            'payment_platform.required' => 'Indica la plataforma de pago.',
            'payment_reference.required' => 'Indica la referencia del pago.',
            'payment_date.required' => 'Indica la fecha del pago.',
            'proof.required' => 'Sube el comprobante de pago.',
            'proof.image' => 'El comprobante debe ser una imagen (JPEG, PNG o WebP).',
            'proof.mimes' => 'El comprobante debe ser una imagen JPEG, PNG o WebP.',
            'proof.max' => 'El comprobante no debe superar 10MB.',
            'proof.uploaded' => 'El archivo no se pudo subir. Verifica que sea una imagen y que no supere 10MB.',
        ]);

        $speaker = $request->user()->speaker;

        if (!$speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        // Check if already has pending or active membership
        $existing = $speaker->memberships()
            ->whereIn('status', ['pending', 'active'])
            ->first();

        if ($existing && $existing->status->value === 'active') {
            return response()->json([
                'message' => 'Ya tienes una membresia activa.',
            ], 422);
        }

        if ($existing && $existing->status->value === 'pending') {
            return response()->json([
                'message' => 'Ya tienes un pago pendiente de aprobacion.',
            ], 422);
        }

        $plan = MembershipPlan::findOrFail($request->plan_id);

        // Store proof file
        $proofPath = $request->file('proof')->store('payment-proofs', 'public');

        Membership::create([
            'speaker_id' => $speaker->id,
            'membership_plan_id' => $plan->id,
            'starts_at' => now(),
            'expires_at' => now()->addDays($plan->duration_days),
            'amount_paid' => $plan->price,
            'currency' => $plan->currency,
            'payment_method' => 'transfer_local',
            'payment_platform' => $request->payment_platform,
            'payment_reference' => $request->payment_reference,
            'payment_date' => $request->payment_date,
            'proof_file' => $proofPath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Comprobante enviado. Tu membresia sera activada una vez validemos el pago.',
        ], 201);
    }
}
