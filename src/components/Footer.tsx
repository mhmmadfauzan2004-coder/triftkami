import React from "react";
import { MessageCircle, Instagram, Shield, ArrowUp, Heart } from "lucide-react";
import type { SiteSettings } from "../types.ts";

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Bio */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.store_name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-stone-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-950 font-black flex items-center justify-center font-display text-sm">
                  KV
                </div>
              )}
              <span className="font-display font-black text-xl text-stone-100 tracking-tight">
                {settings.store_name || "KICKS VAULT"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed">
              {settings.description || "Destinasi terpercaya untuk sneaker second original, vintage grail, dan streetwear preloved berkualitas dengan transparansi kondisi 100%."}
            </p>
          </div>

          {/* Direct Quick Channels */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
              Hubungi Kami
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-200 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  WA: +{settings.whatsapp_number}
                </a>
              </li>
              {settings.instagram_url && (
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-200 transition-colors flex items-center gap-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    IG: @{settings.instagram_username || "store"}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="md:col-span-3 space-y-2 flex flex-col items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Kembali ke Atas
            </button>

            <button
              onClick={onOpenAdmin}
              className="text-[11px] font-mono text-stone-500 hover:text-stone-300 flex items-center gap-1 pt-2 transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3" />
              Portal Pengelola / Admin Toko
            </button>

            <button
              onClick={() => {
                const htmlContent = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${settings.store_name || "KICKS VAULT"} — Curated Secondhand Sneakers</title>
    <meta name="description" content="${settings.description || "Toko sepatu second original terkurasi dengan kondisi grade A, legit check terpercaya, dan pemesanan instan via WhatsApp."}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-stone-950 text-stone-100 antialiased selection:bg-stone-100 selection:text-stone-900 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
                const blob = new Blob([htmlContent], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "index.html";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-[11px] font-mono text-stone-500 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Unduh file index.html ke HP"
            >
              <span>📥 Unduh index.html</span>
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} {settings.store_name || "KICKS VAULT"}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Curated with care for Sneakerheads.
          </p>
        </div>

      </div>
    </footer>
  );
};
