export interface Speaker {
  id: number;
  uuid: string;
  slug: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio_short: string;
  bio_long?: string;
  city: string;
  state?: string;
  country: string;
  phone?: string;
  linkedin_url?: string;
  website_url?: string;
  video_url?: string;
  modality: 'presencial' | 'virtual' | 'both';
  fee_range?: string;
  experience_years?: number;
  is_featured: boolean;
  is_verified: boolean;
  photo_url: string;
  cover_url?: string;
  cover_position?: number;
  categories: CategoryCompact[];
  topics: TopicCompact[];
  languages?: Language[];
  gallery_urls?: string[];
  has_active_membership?: boolean;
}

export interface CategoryCompact {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  topics_count: number;
  topics: Topic[];
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category_name?: string;
}

export interface TopicCompact {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface Testimonial {
  id: number;
  company_name: string;
  contact_name: string;
  contact_role?: string;
  quote: string;
  rating: number;
}

export interface Addon {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_type: 'one_time' | 'monthly' | 'yearly';
}

export interface Membership {
  speaker_id: number;
  starts_at: string;
  expires_at: string;
  status: 'active' | 'expired' | 'cancelled';
  is_active: boolean;
}

export interface CompanyLeadForm {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  sector: string;
  city: string;
  event_type: string;
  event_topic: string;
  audience_description?: string;
  budget_range: string;
  event_date?: string;
  modality: 'presencial' | 'virtual' | 'both';
  message?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
  type?: 'general' | 'speaker' | 'empresa';
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  has_speaker_profile: boolean;
  speaker_slug?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PublicStats {
  total_speakers: number;
  total_categories: number;
  total_countries: number;
  total_topics: number;
}
