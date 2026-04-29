<?php

namespace App\Models;

use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class CompanyLead extends Model
{
    protected $fillable = [
        'uuid',
        'company_name',
        'contact_name',
        'email',
        'phone',
        'sector',
        'city',
        'event_type',
        'event_topic',
        'audience_description',
        'budget_range',
        'event_date',
        'modality',
        'message',
        'status',
        'source',
        'kommo_lead_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => LeadStatus::class,
            'event_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CompanyLead $lead) {
            if (empty($lead->uuid)) {
                $lead->uuid = Str::uuid()->toString();
            }
        });
    }

    public function conciergeRequest(): HasOne
    {
        return $this->hasOne(ConciergeRequest::class);
    }
}
