import React from "react";
import { MessageCircle, Instagram, Shield, Search, Sparkles, MapPin, Clock } from "lucide-react";
import type { SiteSettings } from "../types.ts";

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onScrollToCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  isAdminLoggedIn,
  onScrollToCatalog
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-all">
      {/* Announcement Bar */}
      {settings.announcement_enabled && settings.announcement_text && (
        <div className="bg-stone-900 border-b border-stone-800 text-stone-300 px-4 py-1.5 text-xs font-mono tracking-wider text-center flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{settings.announcement_text}</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.store_name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg object-cover border border-stone-700 group-hover:border-stone-400 transition-colors shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-stone-100 text-stone-950 font-black flex items-center justify-center font-display text-base">
                KV
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-stone-100 group-hover:text-white transition-colors">
                {settings.store_name || "KICKS VAULT"}
              </span>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-stone-400 uppercase -mt-0.5">
                Authentic Preloved
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={onScrollToCatalog}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Katalog Sepatu
          </button>
          <a
            href="#legit-guarantee"
            className="hover:text-white transition-colors py-1"
          >
            Garansi Original
          </a>
          <a
            href="#store-info"
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            Lokasi Store
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instagram Button */}
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-all flex items-center gap-1.5 text-xs font-medium"
              title={`Instagram @${settings.instagram_username || "store"}`}
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">@{settings.instagram_username || "instagram"}</span>
            </a>
          )}

          {/* WhatsApp Primary Contact Button */}
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${settings.store_name}, saya ingin konsultasi ukuran dan ketersediaan sepatu.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 rounded-lg bg-stone-100 hover:bg-white text-stone-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp Admin</span>
            </a>
          )}

          {/* Admin Entry Trigger */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              isAdminLoggedIn
                ? "bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-900/50"
                : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200 hover:bg-stone-800"
            }`}
            title={isAdminLoggedIn ? "Buka Dashboard Admin (Aktif)" : "Login Admin Dashboard"}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden lg:inline">{isAdminLoggedIn ? "Admin Panel" : "Admin"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
