export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SUPABASE POSTGRESQL SCHEMA FOR KICKS VAULT
-- Jalankan query ini di Supabase SQL Editor:
-- ==========================================

-- 1. Table products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'sold'
  box_condition TEXT DEFAULT 'Good Box',
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table site_settings (Single row key-value or config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_config',
  store_name TEXT NOT NULL DEFAULT 'KICKS VAULT',
  logo_url TEXT,
  description TEXT,
  whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
  instagram_username TEXT DEFAULT 'kicksvault.id',
  instagram_url TEXT DEFAULT 'https://instagram.com/kicksvault.id',
  address TEXT,
  opening_hours TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_banner_url TEXT,
  whatsapp_button_text TEXT DEFAULT 'Beli via WhatsApp',
  whatsapp_message_template TEXT,
  announcement_text TEXT,
  announcement_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Publik dapat membaca katalog dan pengaturan
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

-- Hanya authenticated admin yang dapat memodifikasi
CREATE POLICY "Admin manage products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL TO authenticated USING (true);
`;

export const SUPABASE_CONFIG_GUIDE = `
### Langkah Menghubungkan ke Supabase (Opsional):
1. Buat project baru di https://supabase.com
2. Buka tab **SQL Editor** dan jalankan schema SQL di atas.
3. Buka **Project Settings** > **API** untuk mendapatkan:
   - \`SUPABASE_URL\`
   - \`SUPABASE_ANON_KEY\`
4. Masukkan environment variable ke dalam \`.env.example\` & \`.env\`.
5. Semua query data sudah dipersiapkan sesuai struktur tabel di atas.
`;
