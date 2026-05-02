<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpeakerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'bio_short' => ['required', 'string', 'max:300'],
            'bio_long' => ['nullable', 'string', 'max:5000'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
            'linkedin_url' => ['nullable', 'url'],
            'website_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'url'],
            'modality' => ['required', 'in:presencial,virtual,both'],
            'fee_range' => ['nullable', 'string', 'max:50'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['exists:categories,id'],
            'topic_ids' => ['nullable', 'array'],
            'topic_ids.*' => ['exists:topics,id'],
            'language_ids' => ['required', 'array', 'min:1'],
            'language_ids.*' => ['exists:languages,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'bio_short.required' => 'La biografía corta es obligatoria.',
            'bio_short.max' => 'La biografía corta no puede superar los 300 caracteres.',
            'city.required' => 'La ciudad es obligatoria.',
            'country.required' => 'El país es obligatorio.',
            'modality.required' => 'La modalidad es obligatoria.',
            'modality.in' => 'La modalidad debe ser presencial, virtual o ambas.',
            'category_ids.required' => 'Debe seleccionar al menos una categoría.',
            'category_ids.min' => 'Debe seleccionar al menos una categoría.',
            'language_ids.required' => 'Debe seleccionar al menos un idioma.',
            'language_ids.min' => 'Debe seleccionar al menos un idioma.',
        ];
    }
}
