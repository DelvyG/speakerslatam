<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->integer('duration_days')->default(365);
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('payment_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->text('details');
            $table->text('instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Add payment proof fields to memberships
        Schema::table('memberships', function (Blueprint $table) {
            $table->foreignId('membership_plan_id')->nullable()->after('speaker_id')->constrained()->nullOnDelete();
            $table->string('payment_platform')->nullable()->after('payment_method');
            $table->string('payment_reference')->nullable()->after('payment_platform');
            $table->date('payment_date')->nullable()->after('payment_reference');
            $table->string('proof_file')->nullable()->after('payment_date');
        });
    }

    public function down(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropForeign(['membership_plan_id']);
            $table->dropColumn(['membership_plan_id', 'payment_platform', 'payment_reference', 'payment_date', 'proof_file']);
        });
        Schema::dropIfExists('payment_accounts');
        Schema::dropIfExists('membership_plans');
    }
};
