<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConciergeRequest extends Model
{
    protected $fillable = [
        'company_lead_id',
        'admin_notes',
        'proposed_speaker_ids',
        'selected_speaker_id',
        'contract_value',
        'commission_rate',
        'commission_amount',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'proposed_speaker_ids' => 'array',
            'contract_value' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'closed_at' => 'datetime',
        ];
    }

    public function companyLead(): BelongsTo
    {
        return $this->belongsTo(CompanyLead::class);
    }

    public function selectedSpeaker(): BelongsTo
    {
        return $this->belongsTo(Speaker::class, 'selected_speaker_id');
    }
}
