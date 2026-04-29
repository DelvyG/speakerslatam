<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('speakers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('bio_short', 300)->nullable();
            $table->text('bio_long')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('Venezuela');
            $table->string('phone', 20)->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('video_url')->nullable();
            $table->string('modality')->default('both'); // presencial, virtual, both
            $table->string('fee_range')->nullable();
            $table->integer('experience_years')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->string('status')->default('pending'); // pending, active, inactive, rejected
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Pivots
        Schema::create('category_speaker', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('speaker_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'speaker_id']);
        });

        Schema::create('speaker_topic', function (Blueprint $table) {
            $table->foreignId('speaker_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->primary(['speaker_id', 'topic_id']);
        });

        Schema::create('language_speaker', function (Blueprint $table) {
            $table->foreignId('language_id')->constrained()->cascadeOnDelete();
            $table->foreignId('speaker_id')->constrained()->cascadeOnDelete();
            $table->primary(['language_id', 'speaker_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('language_speaker');
        Schema::dropIfExists('speaker_topic');
        Schema::dropIfExists('category_speaker');
        Schema::dropIfExists('speakers');
    }
};
