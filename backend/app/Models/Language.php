<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Language extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];

    public function speakers(): BelongsToMany
    {
        return $this->belongsToMany(Speaker::class);
    }
}
