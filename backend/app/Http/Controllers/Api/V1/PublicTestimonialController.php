<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicTestimonialController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $testimonials = Testimonial::featured()
            ->limit(10)
            ->get();

        return TestimonialResource::collection($testimonials);
    }
}
