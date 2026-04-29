<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_leads', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('sector')->nullable();
            $table->string('city')->nullable();
            $table->string('event_type')->nullable(); // keynote, workshop, curaduria
            $table->string('event_topic');
            $table->text('audience_description')->nullable();
            $table->string('budget_range')->nullable();
            $table->date('event_date')->nullable();
            $table->string('modality')->nullable(); // presencial, virtual
            $table->text('message')->nullable();
            $table->string('status')->default('new'); // new, contacted, proposal_sent, closed_won, closed_lost
            $table->string('source')->default('website');
            $table->string('kommo_lead_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_leads');
    }
};
