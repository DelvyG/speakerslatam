<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concierge_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_lead_id')->constrained()->cascadeOnDelete();
            $table->text('admin_notes')->nullable();
            $table->json('proposed_speaker_ids')->nullable();
            $table->foreignId('selected_speaker_id')->nullable()->constrained('speakers')->nullOnDelete();
            $table->decimal('contract_value', 10, 2)->nullable();
            $table->decimal('commission_rate', 5, 2)->nullable();
            $table->decimal('commission_amount', 10, 2)->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concierge_requests');
    }
};
