import type { Product, SiteSettings, AuthState } from "../types.ts";

const API_BASE = "/api";

export const DEFAULT_SETTINGS: SiteSettings = {
  store_name: "KICKS VAULT",
  logo_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80",
  description: "Curated Authentic Preloved & Secondhand Sneakers. Handpicked, Legit Checked, and Ready to Wear.",
  whatsapp_number: "6281234567890",
  instagram_username: "kicksvault.id",
  instagram_url: "https://instagram.com/kicksvault.id",
  address: "Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190",
  opening_hours: "Senin - Minggu: 11:00 - 21:00 WIB",
  hero_title: "CURATED SECONDHAND SNEAKERS & STREETWEAR",
  hero_subtitle: "Dapatkan sneaker vintage, grail, dan hypebeast second original berkualitas grade A dengan garansi 100% authentic.",
  hero_banner_url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=85",
  whatsapp_button_text: "Beli via WhatsApp",
  whatsapp_message_template: "Halo {store_name}, saya tertarik untuk membeli sepatu ini:\n\n*Nama*: {product_name}\n*Brand*: {brand}\n*Size*: {size}\n*Kondisi*: {condition}\n*Harga*: {price}\n\nApakah item ini masih tersedia? Terima kasih!",
  announcement_text: "🔥 NEW DROP EVERY FRIDAY 19:00 WIB | FREE SNEAKER CLEANING WIPES SETIAP PEMBELIAN 🔥",
  announcement_enabled: true
};

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Gagal memuat produk");
      return await res.json();
    } catch (err) {
      console.warn("Failed to fetch products from backend, using fallback cache", err);
      const cached = localStorage.getItem("kv_products_cache");
      return cached ? JSON.parse(cached) : [];
    }
  },

  async createProduct(product: Omit<Product, "id" | "created_at">, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menambah produk");
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mengubah produk");
    return data.product;
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menghapus produk");
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error("Gagal memuat pengaturan");
      const data = await res.json();
      return { ...DEFAULT_SETTINGS, ...data };
    } catch (err) {
      console.warn("Failed to fetch settings from backend, using default/cached", err);
      const cached = localStorage.getItem("kv_settings_cache");
      return cached ? { ...DEFAULT_SETTINGS, ...JSON.parse(cached) } : DEFAULT_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>, token: string): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menyimpan pengaturan");
    return data.settings;
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; username: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login gagal");
    return { token: data.token, username: data.username };
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      return data.valid === true;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mengganti password");
  },

  async resetToDefault(token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reset-data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mereset data");
  }
};

// Formatting helpers
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function cleanPhone(phone: string): string {
  // strip spaces, dashes, +
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppLink(
  settings: SiteSettings,
  product?: Product,
  customMsg?: string
): string {
  const phone = cleanPhone(settings.whatsapp_number || "6281234567890");
  
  if (customMsg) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(customMsg)}`;
  }

  if (!product) {
    const defaultMsg = `Halo ${settings.store_name}, saya ingin bertanya tentang stok sepatu yang tersedia.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const template = settings.whatsapp_message_template || 
    "Halo {store_name}, saya tertarik untuk membeli sepatu ini:\n\n*Nama*: {product_name}\n*Brand*: {brand}\n*Size*: {size}\n*Kondisi*: {condition}\n*Harga*: {price}\n\nApakah item ini masih tersedia?";

  const message = template
    .replace(/{store_name}/g, settings.store_name || "Kicks Vault")
    .replace(/{product_name}/g, product.name)
    .replace(/{brand}/g, product.brand)
    .replace(/{size}/g, product.size)
    .replace(/{condition}/g, product.condition)
    .replace(/{price}/g, formatIDR(product.price))
    .replace(/{sku}/g, product.sku || "-");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
