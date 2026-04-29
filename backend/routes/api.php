<?php

use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CompanyLeadController;
use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\LegalPageController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PublicAddonController;
use App\Http\Controllers\Api\V1\PublicCategoryController;
use App\Http\Controllers\Api\V1\PublicLanguageController;
use App\Http\Controllers\Api\V1\PublicSpeakerController;
use App\Http\Controllers\Api\V1\PublicStatsController;
use App\Http\Controllers\Api\V1\PublicTestimonialController;
use App\Http\Controllers\Api\V1\PublicTopicController;
use App\Http\Controllers\Api\V1\SpeakerMembershipController;
use App\Http\Controllers\Api\V1\SpeakerProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public - Speakers
    Route::get('speakers', [PublicSpeakerController::class, 'index']);
    Route::get('speakers/featured', [PublicSpeakerController::class, 'featured']);
    Route::get('speakers/{slug}', [PublicSpeakerController::class, 'show']);

    // Public - Categories & Topics
    Route::get('categories', [PublicCategoryController::class, 'index']);
    Route::get('categories/{slug}', [PublicCategoryController::class, 'show']);
    Route::get('topics', [PublicTopicController::class, 'index']);

    // Public - Languages
    Route::get('languages', [PublicLanguageController::class, 'index']);

    // Public - Testimonials
    Route::get('testimonials', [PublicTestimonialController::class, 'index']);

    // Public - Addons
    Route::get('addons', [PublicAddonController::class, 'index']);

    // Public - Stats
    Route::get('stats', [PublicStatsController::class, 'index']);

    // Public - Company Leads
    Route::post('company-leads', [CompanyLeadController::class, 'store']);

    // Public - Contact
    Route::post('contact', [ContactMessageController::class, 'store']);

    // Public - Legal pages
    Route::get('legal/{slug}', [LegalPageController::class, 'show']);

    // Public - Newsletter
    Route::post('newsletter/subscribe', [NewsletterController::class, 'store']);

    // Analytics
    Route::post('analytics/track', [AnalyticsController::class, 'track'])->middleware('throttle:60,1');
    Route::post('analytics/heartbeat', [AnalyticsController::class, 'heartbeat'])->middleware('throttle:120,1');

    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/user', [AuthController::class, 'user']);

        // Speaker dashboard
        Route::prefix('speaker')->group(function () {
            Route::get('profile', [SpeakerProfileController::class, 'show']);
            Route::put('profile', [SpeakerProfileController::class, 'update']);
            Route::post('profile/photo', [SpeakerProfileController::class, 'uploadPhoto']);
            Route::post('profile/gallery', [SpeakerProfileController::class, 'uploadGallery']);
            Route::get('membership', [SpeakerMembershipController::class, 'show']);
            Route::get('addons', [SpeakerMembershipController::class, 'addons']);
        });
    });
});
