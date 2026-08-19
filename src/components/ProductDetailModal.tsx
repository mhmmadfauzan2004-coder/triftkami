import React, { useState } from "react";
import { X, MessageCircle, ShieldCheck, Box, Sparkles, Copy, Check, ExternalLink, Share2 } from "lucide-react";
import type { Product, SiteSettings } from "../types.ts";
import { formatIDR, generateWhatsAppLink } from "../lib/api.ts";

interface ProductDetailModalProps {
  product: Product | null;
  settings: SiteSettings;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const allImages = [
    product.image_url,
    ...(product.additional_images || [])
  ].filter(Boolean);

  const isSold = product.status === "sold";
  const whatsappUrl = generateWhatsAppLink(settings, product);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              {product.brand}
            </span>
            {product.sku && (
              <span className="text-[11px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-2xl bg-stone-950 overflow-hidden border border-stone-800">
              <img
                src={allImages[activeImageIndex] || product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center ${isSold ? "grayscale opacity-60" : ""}`}
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {isSold ? (
                  <span className="px-3 py-1 rounded-md bg-stone-950/90 border border-stone-700 text-stone-400 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    TERJUAL (SOLD)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    TERSEDIA (READY)
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails if multiple images exist */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-stone-100 scale-95"
                        : "border-stone-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Order Box */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Product Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-100 leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-display font-black text-stone-100">
                    {formatIDR(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm font-mono text-stone-500 line-through">
                      {formatIDR(product.original_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Spec Badges Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                  <p className="text-[10px] font-mono text-stone-400 uppercase">Ukuran (Size)</p>
                  <p className="text-sm font-bold text-stone-100 font-mono mt-0.5">{product.size}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                  <p className="text-[10px] font-mono text-stone-400 uppercase">Kondisi Sepatu</p>
                  <p className="text-sm font-bold text-stone-100 font-mono mt-0.5">{product.condition}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 col-span-2">
                  <p className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
                    <Box className="w-3 h-3 text-stone-400" />
                    Kelengkapan Box & Aksesoris
                  </p>
                  <p className="text-xs font-semibold text-stone-200 mt-0.5">
                    {product.box_condition || "Box pengganti / No box"}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                  Deskripsi & Detail Kondisi:
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line bg-stone-950/50 p-3.5 rounded-xl border border-stone-800/60">
                  {product.description || "Tidak ada catatan khusus. Kondisi sesuai foto."}
                </p>
              </div>

              {/* Authenticity Guarantee Box */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">100% Authentic Guarantee</p>
                  <p className="text-[11px] text-emerald-400/80 leading-normal mt-0.5">
                    Uang kembali 100% jika terbukti fake/palsu. Telah dicek langsung oleh tim kurator.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-stone-800 space-y-2.5">
              {isSold ? (
                <div className="p-3 rounded-xl bg-stone-800 text-stone-400 text-center font-semibold text-sm">
                  Item Ini Sudah Terjual (Sold Out)
                </div>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                  <span>{settings.whatsapp_button_text || "Beli via WhatsApp Sekarang"}</span>
                </a>
              )}

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 hover:text-stone-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Tersalin!" : "Bagikan Sepatu Ini"}</span>
                </button>

                <span className="text-[11px] font-mono text-stone-500">
                  Respon Cepat Jam Kerja
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
