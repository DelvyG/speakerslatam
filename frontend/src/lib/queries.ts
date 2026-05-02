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
  BlogPost,
  BlogCategory,
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
    '/newsletter/subscribe',
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

// ── Blog (public) ───────────────────────────────────────────────────

export async function getBlogPosts(
  params?: { page?: number; per_page?: number; category?: string; search?: string; featured?: boolean },
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await api.get<PaginatedResponse<BlogPost>>('/blog/posts', { params });
  return data;
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const { data } = await api.get<{ data: BlogPost }>(`/blog/posts/${slug}`);
  return data.data;
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const { data } = await api.get<{ data: BlogPost[] }>('/blog/posts/featured');
  return data.data;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await api.get<{ data: BlogCategory[] }>('/blog/categories');
  return data.data;
}

// ── Blog (speaker dashboard) ────────────────────────────────────────

export async function getSpeakerBlogPosts(
  params?: { page?: number; status?: string },
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await api.get<PaginatedResponse<BlogPost>>('/speaker/blog/posts', { params });
  return data;
}

export async function getSpeakerBlogPost(uuid: string): Promise<BlogPost> {
  const { data } = await api.get<{ data: BlogPost }>(`/speaker/blog/posts/${uuid}`);
  return data.data;
}

export async function createBlogPost(
  postData: { title: string; excerpt?: string; body?: string; category_ids?: number[] },
): Promise<BlogPost> {
  const { data } = await api.post<{ data: BlogPost }>('/speaker/blog/posts', postData);
  return data.data;
}

export async function updateBlogPost(
  uuid: string,
  postData: Partial<{ title: string; excerpt: string; body: string; category_ids: number[] }>,
): Promise<BlogPost> {
  const { data } = await api.put<{ data: BlogPost }>(`/speaker/blog/posts/${uuid}`, postData);
  return data.data;
}

export async function deleteBlogPost(uuid: string): Promise<void> {
  await api.delete(`/speaker/blog/posts/${uuid}`);
}

export async function submitBlogPostForReview(uuid: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(`/speaker/blog/posts/${uuid}/submit`);
  return data;
}

export async function uploadBlogPostImage(uuid: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post<{ url: string }>(`/speaker/blog/posts/${uuid}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadBlogFeaturedImage(uuid: string, file: File): Promise<{ url: string; thumb_url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post<{ url: string; thumb_url: string }>(`/speaker/blog/posts/${uuid}/featured-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
