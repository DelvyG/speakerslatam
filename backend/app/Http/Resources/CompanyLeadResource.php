<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyLeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'company_name' => $this->company_name,
            'status' => $this->when(
                $request->user()?->hasRole('admin'),
                $this->status?->value
            ),
        ];
    }
}
