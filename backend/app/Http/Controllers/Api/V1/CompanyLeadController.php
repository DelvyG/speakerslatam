<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyLeadRequest;
use App\Models\CompanyLead;
use Illuminate\Http\JsonResponse;

class CompanyLeadController extends Controller
{
    public function store(StoreCompanyLeadRequest $request): JsonResponse
    {
        CompanyLead::create($request->validated());

        return response()->json([
            'message' => 'Solicitud recibida exitosamente. Nos pondremos en contacto pronto.',
        ], 201);
    }
}
