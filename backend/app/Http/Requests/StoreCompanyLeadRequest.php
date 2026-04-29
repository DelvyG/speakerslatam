<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'sector' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'event_type' => ['required', 'string', 'max:100'],
            'event_topic' => ['required', 'string', 'max:255'],
            'audience_description' => ['nullable', 'string', 'max:1000'],
            'budget_range' => ['required', 'string', 'max:50'],
            'event_date' => ['nullable', 'date', 'after:today'],
            'modality' => ['required', 'in:presencial,virtual,both'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'El nombre de la empresa es obligatorio.',
            'contact_name.required' => 'El nombre de contacto es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ser un correo electrónico válido.',
            'sector.required' => 'El sector es obligatorio.',
            'city.required' => 'La ciudad es obligatoria.',
            'event_type.required' => 'El tipo de evento es obligatorio.',
            'event_topic.required' => 'El tema del evento es obligatorio.',
            'budget_range.required' => 'El rango de presupuesto es obligatorio.',
            'event_date.after' => 'La fecha del evento debe ser posterior a hoy.',
            'modality.required' => 'La modalidad es obligatoria.',
            'modality.in' => 'La modalidad debe ser presencial, virtual o ambas.',
        ];
    }
}
