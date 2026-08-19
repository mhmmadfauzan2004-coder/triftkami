import React from "react";
import { MapPin, Clock, ShieldCheck, CheckCircle2, HelpCircle, MessageCircle, Instagram, Sparkles, Truck } from "lucide-react";
import type { SiteSettings } from "../types.ts";

interface StoreInfoSectionProps {
  settings: SiteSettings;
}

export const StoreInfoSection: React.FC<StoreInfoSectionProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Halo ${settings.store_name}, saya ingin bertanya tentang lokasi dan jam operasional store.`
  )}`;

  return (
    <div id="store-info" className="border-t border-stone-800 bg-stone-950/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top: Location & Operational Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Store Location Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-stone-200">
                <MapPin className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-100">
                Store Location / Workshop
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {settings.address || "Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190"}
              </p>
              <p className="text-xs text-stone-400">
                Tersedia layanan fitting langsung (appointment), COD area sekitar, atau pengiriman kurir instan (Grab/Gojek) & ekspedisi JNE/J&T seluruh Indonesia.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address || settings.store_name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Petunjuk Arah Google Maps
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-white text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                Share Lokasi via WA
              </a>
            </div>
          </div>

          {/* Operational Hours & Instant WhatsApp Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-stone-200">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-100">
                Jam Operasional & Pelayanan
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-200">
                  {settings.opening_hours || "Senin - Minggu: 11:00 - 21:00 WIB"}
                </p>
                <p className="text-xs text-stone-400">
                  Respon pesan WhatsApp & pengiriman dilakukan setiap hari. Order sebelum jam 17:00 dikirim di hari yang sama.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  Follow @{settings.instagram_username || "instagram"}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Legit Check & Purchasing Guarantee Section */}
        <div id="legit-guarantee" className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border border-stone-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 font-mono text-xs uppercase tracking-wider">
              Quality Assurance
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
              Standar Kurasi & Jaminan Keaslian
            </h3>
            <p className="text-stone-400 text-sm">
              Kami memahami kekhawatiran membeli sneaker second. Berikut komitmen kami untuk memastikan kepuasan Anda:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">
                1
              </div>
              <h4 className="font-bold text-stone-100 text-base">Garansi 100% Authentic</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Setiap pasang sepatu telah diinspeksi secara manual (stitching, insole, font size tag, smell test, UV light). Uang kembali penuh bila terbukti fake.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 font-bold">
                2
              </div>
              <h4 className="font-bold text-stone-100 text-base">Deep Clean & Sanitized</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Semua unit sepatu sudah melalui proses deep cleaning premium, disinfektan antibakteri, dan treatment khusus sehingga wangi serta siap langsung dipakai.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">
                3
              </div>
              <h4 className="font-bold text-stone-100 text-base">Double Box Packaging</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pengiriman dijamin aman menggunakan bubble wrap tebal dan double outer box pelindung agar box sepatu tidak penyok selama perjalanan.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
