export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  original_price?: number;
  description: string;
  image_url: string;
  additional_images?: string[];
  status: 'available' | 'sold';
  box_condition?: string;
  sku?: string;
  created_at: string;
}

export interface SiteSettings {
  store_name: string;
  logo_url: string;
  description: string;
  whatsapp_number: string;
  instagram_username: string;
  instagram_url: string;
  address: string;
  opening_hours: string;
  hero_title: string;
  hero_subtitle: string;
  hero_banner_url?: string;
  whatsapp_button_text: string;
  whatsapp_message_template: string;
  announcement_text?: string;
  announcement_enabled?: boolean;
}

export interface AdminUser {
  username: string;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
}
