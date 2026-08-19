import React from "react";
import { MessageCircle, Eye, Tag, Check, Sparkles } from "lucide-react";
import type { Product, SiteSettings } from "../types.ts";
import { formatIDR, generateWhatsAppLink } from "../lib/api.ts";

interface ProductCardProps {
  product: Product;
  settings: SiteSettings;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onSelect
}) => {
  const isSold = product.status === "sold";
  const whatsappUrl = generateWhatsAppLink(settings, product);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSold) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-stone-600/80 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-stone-950 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isSold ? "grayscale opacity-50" : ""
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Status Badge */}
          {isSold ? (
            <span className="px-2.5 py-1 rounded-md bg-stone-950/90 border border-stone-700 text-stone-400 font-mono text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
              SOLD OUT
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 font-mono text-[11px] font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AVAILABLE
            </span>
          )}

          {/* Condition Badge */}
          <span className="px-2.5 py-1 rounded-md bg-stone-950/90 border border-stone-700 text-stone-200 font-mono text-[11px] font-semibold backdrop-blur-md shadow-sm">
            {product.condition}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-xl bg-stone-100/95 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail Foto
          </span>
        </div>

        {/* Brand Tag Pill at bottom-left of image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-800 backdrop-blur-sm">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Shoe Name */}
          <h3 className="font-display font-bold text-stone-100 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {product.name}
          </h3>

          {/* Shoe Specs: Size & Box */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-stone-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-stone-800/80 border border-stone-700/60 text-stone-200">
              Size: {product.size}
            </span>
            {product.box_condition && (
              <span className="px-2 py-0.5 rounded bg-stone-800/40 border border-stone-700/30 text-stone-400 truncate max-w-[140px]">
                {product.box_condition}
              </span>
            )}
          </div>

          {/* Brief Description */}
          {product.description && (
            <p className="mt-2.5 text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Buy Action */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono uppercase text-stone-500">Harga Second</p>
              <p className="font-display font-extrabold text-lg sm:text-xl text-stone-100 tracking-tight">
                {formatIDR(product.price)}
              </p>
            </div>

            {product.original_price && product.original_price > product.price && (
              <div className="text-right">
                <p className="text-[10px] font-mono text-stone-500 line-through">
                  {formatIDR(product.original_price)}
                </p>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  Hemat {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Primary Action: Buy via WhatsApp */}
          {isSold ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-stone-800 text-stone-500 font-medium text-xs sm:text-sm cursor-not-allowed text-center"
            >
              Sudah Terjual (Sold Out)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>{settings.whatsapp_button_text || "Beli via WhatsApp"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
