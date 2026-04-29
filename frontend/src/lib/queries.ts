import api from './api';
import type {
  Speaker,
  Category,
  Topic,
  Language,
  Testimonial,
  Addon,
  PublicStats,
  CompanyLeadForm,
  ContactForm,
  NewsletterForm,
  LoginForm,
  RegisterForm,
  AuthUser,
  PaginatedResponse,
} from '@/types';

// ── Speaker filter params ────────────────────────────────────────────

export interface SpeakerFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  topic?: string;
  country?: string;
  modality?: 'presencial' | 'virtual' | 'both';
  language?: string;
  is_featured?: boolean;
}

// ── Public endpoints ─────────────────────────────────────────────────

export async function getSpeakers(
  params?: SpeakerFilters,
): Promise<PaginatedResponse<Speaker>> {
  const { data } = await api.get<PaginatedResponse<Speaker>>('/speakers', {
    params,
  });
  return data;
}

export async function getSpeaker(slug: string): Promise<Speaker> {
  const { data } = await api.get<{ data: Speaker }>(`/speakers/${slug}`);
  return data.data;
}

export async function getFeaturedSpeakers(): Promise<Speaker[]> {
  const { data } = await api.get<{ data: Speaker[] }>('/speakers/featured');
  return data.data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<{ data: Category[] }>('/categories');
  return data.data;
}

export async function getCategory(slug: string): Promise<Category> {
  const { data } = await api.get<{ data: Category }>(`/categories/${slug}`);
  return data.data;
}

export async function getTopics(): Promise<Topic[]> {
  const { data } = await api.get<{ data: Topic[] }>('/topics');
  return data.data;
}

export async function getLanguages(): Promise<Language[]> {
  const { data } = await api.get<{ data: Language[] }>('/languages');
  return data.data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await api.get<{ data: Testimonial[] }>('/testimonials');
  return data.data;
}

export async function getAddons(): Promise<Addon[]> {
  const { data } = await api.get<{ data: Addon[] }>('/addons');
  return data.data;
}

export async function getStats(): Promise<PublicStats> {
  const { data } = await api.get<{ data: PublicStats }>('/stats');
  return data.data;
}

// ── Forms / mutations ────────────────────────────────────────────────

export async function submitCompanyLead(
  formData: CompanyLeadForm,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/company-leads',
    formData,
  );
  return data;
}

export async function submitContactMessage(
  formData: ContactForm,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/contact',
    formData,
  );
  return data;
}

export async function subscribeNewsletter(
  formData: NewsletterForm,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/newsletter',
    formData,
  );
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────

export async function login(
  formData: LoginForm,
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    '/auth/login',
    formData,
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function register(
  formData: RegisterForm,
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    '/auth/register',
    formData,
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ data: AuthUser }>('/auth/me');
  return data.data;
}

// ── Speaker dashboard (authenticated) ────────────────────────────────

export async function getSpeakerProfile(): Promise<Speaker> {
  const { data } = await api.get<{ data: Speaker }>('/speaker/profile');
  return data.data;
}

export async function updateSpeakerProfile(
  profileData: Partial<Speaker>,
): Promise<Speaker> {
  const { data } = await api.put<{ data: Speaker }>(
    '/speaker/profile',
    profileData,
  );
  return data.data;
}
