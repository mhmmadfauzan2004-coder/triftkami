import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, MessageCircle, Instagram, Store, Sparkles, MapPin, Clock, Layout, RefreshCw } from "lucide-react";
import type { SiteSettings } from "../../types.ts";
import { api, cleanPhone } from "../../lib/api.ts";

interface AdminSettingsProps {
  settings: SiteSettings;
  token: string;
  onRefresh: () => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  token,
  onRefresh
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("logo_url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("hero_banner_url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      await api.updateSettings(formData, token);
      await onRefresh();
      setStatusMsg({
        text: "Pengaturan website berhasil disimpan! Halaman customer sekarang otomatis diperbarui.",
        type: "success"
      });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({
        text: err.message || "Gagal menyimpan pengaturan",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
            Pengaturan Website & Toko
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Ubah identitas brand, kontak WhatsApp, Instagram, dan teks tampilan website secara dinamis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-700 text-emerald-300"
              : "bg-rose-950/70 border border-rose-800 text-rose-300"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Identitas Toko & Brand */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-stone-400" />
            <h3 className="font-display font-bold text-stone-100 text-base">
              1. Identitas Brand & Toko
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Nama Toko / Brand *
              </label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => handleChange("store_name", e.target.value)}
                placeholder="Contoh: KICKS VAULT STORE"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Logo Image URL / Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Logo Toko (URL atau Upload)
              </label>
              <div className="flex items-center gap-3">
                {formData.logo_url && (
                  <img
                    src={formData.logo_url}
                    alt="Logo preview"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-stone-950 border border-stone-800 shrink-0"
                  />
                )}
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                />
                <label className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold shrink-0 cursor-pointer transition-colors">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Store Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Deskripsi Singkat Toko (Muncul di Header & Footer)
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Contoh: Curated Authentic Preloved & Secondhand Sneakers. Handpicked, Legit Checked, and Ready to Wear."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kontak WhatsApp & Instagram */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-stone-100 text-base">
              2. WhatsApp & Media Sosial Instagram
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Nomor WhatsApp Admin (Untuk Menerima Order) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="6281234567890 (Gunakan kode negara 62)"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              <p className="text-[11px] font-mono text-stone-500">
                Format wa.me aktif:{" "}
                <span className="text-emerald-400 font-bold">
                  https://wa.me/{cleanPhone(formData.whatsapp_number)}
                </span>
              </p>
            </div>

            {/* WhatsApp Button Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Label Teks Tombol WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_button_text}
                onChange={(e) => handleChange("whatsapp_button_text", e.target.value)}
                placeholder="Contoh: Beli via WhatsApp / Order via WA"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Instagram Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Username Instagram
              </label>
              <input
                type="text"
                value={formData.instagram_username}
                onChange={(e) => handleChange("instagram_username", e.target.value)}
                placeholder="kicksvault.id"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Instagram Full Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Link URL Instagram Lengkap
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/kicksvault.id"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* WhatsApp Message Template */}
            <div className="sm:col-span-2 space-y-1.5 pt-2">
              <label className="text-xs font-mono font-medium text-stone-300">
                Template Pesan Otomatis WhatsApp Saat Customer Klik Beli
              </label>
              <textarea
                rows={4}
                value={formData.whatsapp_message_template}
                onChange={(e) => handleChange("whatsapp_message_template", e.target.value)}
                placeholder="Halo {store_name}, saya tertarik untuk membeli: {product_name}..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs font-mono focus:outline-none focus:border-stone-500"
              />
              <p className="text-[11px] font-mono text-stone-500">
                Variabel yang tersedia: <code className="text-amber-400">{"{store_name}"}</code>, <code className="text-amber-400">{"{product_name}"}</code>, <code className="text-amber-400">{"{brand}"}</code>, <code className="text-amber-400">{"{size}"}</code>, <code className="text-amber-400">{"{condition}"}</code>, <code className="text-amber-400">{"{price}"}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Tampilan Hero & Banner Landing Page */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-stone-400" />
            <h3 className="font-display font-bold text-stone-100 text-base">
              3. Tampilan Hero Section & Announcement Bar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Hero Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Judul Hero Section (H1) *
              </label>
              <input
                type="text"
                required
                value={formData.hero_title}
                onChange={(e) => handleChange("hero_title", e.target.value)}
                placeholder="Contoh: CURATED SECONDHAND SNEAKERS & STREETWEAR"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Hero Subtitle */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Subjudul Hero Section *
              </label>
              <textarea
                rows={2}
                required
                value={formData.hero_subtitle}
                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                placeholder="Sepatu second original berkualitas, grade A condition, verified legit..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Hero Banner URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Foto Banner Hero (URL atau Upload)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.hero_banner_url || ""}
                  onChange={(e) => handleChange("hero_banner_url", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                />
                <label className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold shrink-0 cursor-pointer transition-colors">
                  Upload Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Announcement text & switch */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-stone-300">
                  Teks Running Announcement Bar (Paling Atas)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-400">
                  <input
                    type="checkbox"
                    checked={formData.announcement_enabled}
                    onChange={(e) => handleChange("announcement_enabled", e.target.checked)}
                    className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>Tampilkan Bar</span>
                </label>
              </div>
              <input
                type="text"
                value={formData.announcement_text || ""}
                onChange={(e) => handleChange("announcement_text", e.target.value)}
                placeholder="Contoh: 🔥 NEW DROP EVERY FRIDAY | FREE SHIPPING JABODETABEK 🔥"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Lokasi & Jam Operasional */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <h3 className="font-display font-bold text-stone-100 text-base">
              4. Alamat Toko Fisik & Jam Operasional
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Address */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Alamat Lengkap Toko / Offline Store *
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Opening Hours */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Jam Operasional Toko & CS WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.opening_hours}
                onChange={(e) => handleChange("opening_hours", e.target.value)}
                placeholder="Contoh: Setiap Hari: 11:00 - 21:00 WIB"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Menyimpan Data..." : "Simpan Semua Pengaturan"}
          </button>
        </div>

      </form>

    </div>
  );
};
