import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowLeft, Plus, Trash2, Sparkles } from "lucide-react";
import type { Product } from "../../types.ts";
import { api, formatIDR } from "../../lib/api.ts";

interface AdminProductFormProps {
  productToEdit?: Product | null;
  token: string;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

const BRAND_SUGGESTIONS = ["Nike", "Jordan", "Adidas", "New Balance", "Asics", "Salomon", "Converse", "Vans", "Puma", "Onitsuka Tiger"];
const SIZE_SUGGESTIONS = ["40 EUR / 7 US / 25 CM", "40.5 EUR / 7.5 US / 25.5 CM", "41 EUR / 8 US / 26 CM", "42 EUR / 8.5 US / 26.5 CM", "42.5 EUR / 9 US / 27 CM", "43 EUR / 9.5 US / 27.5 CM", "44 EUR / 10 US / 28 CM", "44.5 EUR / 10.5 US / 28.5 CM", "45 EUR / 11 US / 29 CM"];
const CONDITION_SUGGESTIONS = [
  "9.8/10 (Pass As VNDS - Pristine)",
  "9.5/10 (VNDS - Like New)",
  "9.2/10 (Very Good Condition - Minor Wear)",
  "9.0/10 (Great Condition - Clean)",
  "8.5/10 (Good Condition - Natural Creasing)",
  "8.0/10 (Daily Beater - Clean Upper)"
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  productToEdit,
  token,
  onSuccess,
  onCancel
}) => {
  const isEditing = !!productToEdit;

  const [name, setName] = useState(productToEdit?.name || "");
  const [brand, setBrand] = useState(productToEdit?.brand || "Nike");
  const [size, setSize] = useState(productToEdit?.size || "42 EUR / 8.5 US / 26.5 CM");
  const [condition, setCondition] = useState(productToEdit?.condition || "9.5/10 (VNDS - Like New)");
  const [price, setPrice] = useState<number | string>(productToEdit?.price || "");
  const [originalPrice, setOriginalPrice] = useState<number | string>(productToEdit?.original_price || "");
  const [description, setDescription] = useState(productToEdit?.description || "");
  const [imageUrl, setImageUrl] = useState(productToEdit?.image_url || "");
  const [additionalImages, setAdditionalImages] = useState<string[]>(productToEdit?.additional_images || []);
  const [status, setStatus] = useState<"available" | "sold">(productToEdit?.status || "available");
  const [boxCondition, setBoxCondition] = useState(productToEdit?.box_condition || "Complete OG Box");
  const [sku, setSku] = useState(productToEdit?.sku || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle local file upload to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAdditional = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran foto maksimal 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isAdditional) {
        setAdditionalImages((prev) => [...prev, base64]);
      } else {
        setImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = (url: string) => {
    if (url.trim()) {
      setAdditionalImages((prev) => [...prev, url.trim()]);
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !brand || !size || !condition || !price) {
      setError("Mohon lengkapi kolom nama, brand, ukuran, kondisi, dan harga.");
      return;
    }

    if (!imageUrl) {
      setError("Mohon masukkan atau upload foto utama produk.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        brand,
        size,
        condition,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : undefined,
        description,
        image_url: imageUrl,
        additional_images: additionalImages,
        status,
        box_condition: boxCondition,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`
      };

      if (isEditing && productToEdit) {
        await api.updateProduct(productToEdit.id, payload, token);
      } else {
        await api.createProduct(payload, token);
      }

      await onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data produk");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-stone-100">
              {isEditing ? "Edit Sepatu" : "Tambah Sepatu Baru"}
            </h1>
            <p className="text-xs text-stone-400">
              {isEditing ? `Mengubah data ${productToEdit.name}` : "Input sneaker second ke dalam etalase toko"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Photos */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-display font-bold text-stone-100 text-base">
              1. Foto Produk (Utama & Tambahan)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Upload foto asli sepatu dari HP atau masukkan URL foto resolusi tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Primary Image Preview & Uploader */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs font-mono font-medium text-stone-300 block">
                Foto Utama (Cover) *
              </label>

              <div className="relative aspect-square w-full rounded-2xl bg-stone-950 border-2 border-dashed border-stone-700 hover:border-stone-500 overflow-hidden flex flex-col items-center justify-center text-center p-4 transition-colors">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <label className="px-3 py-2 rounded-xl bg-stone-100 text-stone-950 text-xs font-bold cursor-pointer hover:bg-white transition-colors">
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-200">Pilih Foto dari Perangkat</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">PNG, JPG, WebP max 8MB</p>
                    </div>
                    <label className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* URL Alternative input */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400">
                  Atau tempel Link URL Foto Utama:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            {/* Additional Images (Gallery) */}
            <div className="md:col-span-7 space-y-3">
              <label className="text-xs font-mono font-medium text-stone-300 block">
                Foto Detail Lainnya (Insole, Outsole, Size Tag, Box)
              </label>

              <div className="grid grid-cols-3 gap-3">
                {additionalImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-stone-950 border border-stone-800 overflow-hidden group"
                  >
                    <img
                      src={img}
                      alt={`Detail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-900/80 text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add more button */}
                <label className="aspect-square rounded-xl border-2 border-dashed border-stone-800 hover:border-stone-600 flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-colors bg-stone-950/40">
                  <Plus className="w-5 h-5 text-stone-500" />
                  <span className="text-[10px] font-mono text-stone-500 mt-1">Tambah Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Details */}
        <div className="p-5 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-5">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-display font-bold text-stone-100 text-base">
              2. Informasi & Spesifikasi Sepatu
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Nama Model Sepatu *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Air Jordan 1 High OG Chicago 'Lost & Found'"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Brand / Merek *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nike, Jordan, Adidas, New Balance..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {BRAND_SUGGESTIONS.slice(0, 6).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Ukuran (Size EUR / US / CM) *
              </label>
              <input
                type="text"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Contoh: 42.5 EUR / 9 US / 27 CM"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["41 EUR", "42 EUR", "42.5 EUR", "43 EUR", "44 EUR"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(`${s} / Ready`)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Kondisi Sepatu (Score & Grade) *
              </label>
              <input
                type="text"
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Contoh: 9.5/10 (VNDS - Like New)"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CONDITION_SUGGESTIONS.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer truncate max-w-[200px]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Status (Available vs Sold) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Status Ketersediaan *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500 cursor-pointer"
              >
                <option value="available">TERSEDIA (Ready Stock)</option>
                <option value="sold">TERJUAL (Sold Out)</option>
              </select>
            </div>

            {/* Price IDR */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 1850000"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              {price && (
                <p className="text-[11px] font-mono text-emerald-400 font-bold">
                  Format: {formatIDR(Number(price))}
                </p>
              )}
            </div>

            {/* Original Price comparison */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Harga Retail Baru / Perbandingan (Rp - Opsional)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Contoh: 2800000"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
              {originalPrice && (
                <p className="text-[11px] font-mono text-stone-400">
                  Coret: {formatIDR(Number(originalPrice))}
                </p>
              )}
            </div>

            {/* Box Condition */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Kondisi Box & Kelengkapan
              </label>
              <input
                type="text"
                value={boxCondition}
                onChange={(e) => setBoxCondition(e.target.value)}
                placeholder="Contoh: Complete OG Box, extra laces, receipt"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Kode SKU / Style Code (Opsional)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Contoh: DZ5485-612"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-stone-300">
                Catatan Kondisi & Deskripsi Detail
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kondisi toebox, insole, outsole, minus lecet jika ada, riwayat pemakaian, dll..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>

          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-sm font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-white text-stone-950 text-sm font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Publikasikan Sepatu"}
          </button>
        </div>

      </form>
    </div>
  );
};
