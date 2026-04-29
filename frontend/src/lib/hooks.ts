'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getSpeakers,
  getSpeaker,
  getFeaturedSpeakers,
  getCategories,
  getTopics,
  getLanguages,
  getTestimonials,
  getStats,
  getAddons,
  type SpeakerFilters,
} from './queries';

// ── Speaker hooks ────────────────────────────────────────────────────

export function useSpeakers(params?: SpeakerFilters) {
  return useQuery({
    queryKey: ['speakers', params],
    queryFn: () => getSpeakers(params),
  });
}

export function useSpeaker(slug: string) {
  return useQuery({
    queryKey: ['speakers', slug],
    queryFn: () => getSpeaker(slug),
    enabled: !!slug,
  });
}

export function useFeaturedSpeakers() {
  return useQuery({
    queryKey: ['speakers', 'featured'],
    queryFn: getFeaturedSpeakers,
  });
}

// ── Category & Topic hooks ───────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });
}

// ── Misc public hooks ────────────────────────────────────────────────

export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });
}

export function useAddons() {
  return useQuery({
    queryKey: ['addons'],
    queryFn: getAddons,
  });
}
