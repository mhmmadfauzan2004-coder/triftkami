import React from "react";
import { MessageCircle, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import type { SiteSettings } from "../types.ts";

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreClick: () => void;
  totalAvailable: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreClick,
  totalAvailable
}) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Halo ${settings.store_name || "Kicks Vault"}, saya tertarik dengan katalog sepatu second yang ada di website.`
  )}`;

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:py-16 border-b border-stone-800/60 bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950">
      {/* Background Subtle Glow Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            
            {/* Status / Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-700/80 text-xs font-mono text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{totalAvailable} KICKS READY STOCK • GRADE A</span>
            </div>

            {/* Dynamic Hero Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-stone-100 tracking-tight leading-[1.08]">
              {settings.hero_title || "CURATED SECONDHAND SNEAKERS & STREETWEAR"}
            </h1>

            {/* Dynamic Hero Subtitle & Store Description */}
            <p className="text-base sm:text-lg text-stone-400 font-normal leading-relaxed max-w-2xl">
              {settings.hero_subtitle || settings.description || "Sepatu preloved original terkurasi. Setiap pasang telah melewati proses legit check detail, deep clean, dan foto asli tanpa rekayasa."}
            </p>

            {/* Streetwear Badges / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Deep Cleaned</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300 text-xs col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium">Foto Real Asli</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Lihat Katalog Sepatu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{settings.whatsapp_button_text || "Tanya via WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 bg-stone-900 shadow-2xl group">
              <img
                src={
                  settings.hero_banner_url ||
                  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=85"
                }
                alt="Sneakers Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
              
              {/* Floating Info Tag on Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-stone-400">Curated Drop</p>
                  <p className="text-sm font-bold text-stone-100">{settings.store_name || "Kicks Vault"} Collection</p>
                </div>
                <button
                  onClick={onExploreClick}
                  className="text-xs font-bold text-stone-950 bg-stone-100 hover:bg-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Buka Drop
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
