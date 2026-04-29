<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterSpeakerRequest;
use App\Http\Resources\AuthUserResource;
use App\Models\Speaker;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterSpeakerRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
        ]);

        $user->assignRole('speaker');

        // Auto-create speaker profile
        $nameParts = explode(' ', $request->validated('name'), 2);
        Speaker::create([
            'user_id' => $user->id,
            'first_name' => $nameParts[0],
            'last_name' => $nameParts[1] ?? '',
            'bio_short' => '',
            'city' => '',
            'country' => 'Venezuela',
            'modality' => 'presencial',
            'status' => 'pending',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('speaker', 'roles');

        return response()->json([
            'user' => new AuthUserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('speaker', 'roles');

        return response()->json([
            'user' => new AuthUserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente.',
        ]);
    }

    public function user(Request $request): AuthUserResource
    {
        $request->user()->load('speaker', 'roles');

        return new AuthUserResource($request->user());
    }
}
