import React, { useState } from "react";
import { Database, Copy, Check, Download, Upload, RefreshCw, AlertTriangle, Code, FileCode, ExternalLink } from "lucide-react";
import { SUPABASE_SQL_SCHEMA, SUPABASE_CONFIG_GUIDE } from "../../lib/supabase-helper.ts";
import type { Product, SiteSettings } from "../../types.ts";
import { api, formatIDR, generateWhatsAppLink } from "../../lib/api.ts";

interface AdminSupabaseGuideProps {
  products: Product[];
  settings: SiteSettings;
  token: string;
  onRefresh: () => Promise<void>;
}

export const AdminSupabaseGuide: React.FC<AdminSupabaseGuideProps> = ({
  products,
  settings,
  token,
  onRefresh
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const rawIndexHtml = `<!doctype html>
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

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rawIndexHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleDownloadIndexHtml = () => {
    const blob = new Blob([rawIndexHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("File index.html berhasil diunduh ke HP/perangkat Anda!");
    setTimeout(() => setMsg(null), 3500);
  };

  const handleDownloadStandaloneHtml = () => {
    // Generate an all-in-one standalone HTML file with current products & styling
    const standaloneHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.store_name} - Katalog Sepatu Second</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0c0a09; color: #f5f5f4; }
    h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }
  </style>
</head>
<body class="p-4 sm:p-8 max-w-6xl mx-auto">
  <header class="py-6 border-b border-stone-800 flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-black">${settings.store_name}</h1>
      <p class="text-xs text-stone-400 mt-1">${settings.description}</p>
    </div>
    <a href="https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}" class="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl">WhatsApp Admin</a>
  </header>

  <main class="py-8">
    <h2 class="text-xl font-bold mb-6">Katalog Sepatu Ready Stock (${products.length} Item)</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${products.map(p => `
        <div class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <img src="${p.image_url}" alt="${p.name}" class="w-full aspect-square object-cover ${p.status === 'sold' ? 'grayscale opacity-50' : ''}">
          <div class="p-4 flex flex-col gap-2">
            <span class="text-[10px] text-stone-400 font-mono">${p.brand} • Size ${p.size} • ${p.condition}</span>
            <h3 class="font-bold text-sm line-clamp-2">${p.name}</h3>
            <p class="text-emerald-400 font-bold font-mono text-base mt-1">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)}</p>
            ${p.status === 'available' ? `
              <a href="https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent('Halo, saya tertarik dengan ' + p.name + ' (Size ' + p.size + ')')}" target="_blank" class="mt-2 text-center bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs py-2 rounded-xl">Beli via WhatsApp</a>
            ` : `
              <span class="mt-2 text-center bg-stone-800 text-stone-500 text-xs py-2 rounded-xl font-semibold">Sold Out</span>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  </main>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kicks-vault-standalone-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("File Standalone HTML lengkap berhasil diunduh!");
    setTimeout(() => setMsg(null), 3500);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      store: settings.store_name,
      settings,
      products
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kicks-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefault = async () => {
    if (!window.confirm("PERINGATAN: Apakah Anda yakin ingin mereset katalog dan pengaturan kembali ke demo bawaan?")) {
      return;
    }

    setResetting(true);
    try {
      await api.resetToDefault(token);
      await onRefresh();
      setMsg("Katalog dan pengaturan berhasil direset ke data awal!");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || "Gagal mereset data");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="pb-4 border-b border-stone-800">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
          Unduh File Web & Database
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Unduh file <code className="text-amber-400 font-mono">index.html</code>, paket web standalone, atau data backup toko untuk disimpan di HP/komputer.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Direct Download Files Section */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <h3 className="font-display font-bold text-stone-100 text-base flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          Tombol Unduh File HTML &amp; Data Toko
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          Pilih file yang ingin Anda unduh langsung ke memori HP/komputer:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Button 1: Download index.html */}
          <button
            onClick={handleDownloadIndexHtml}
            className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-left space-y-1 transition-all border border-stone-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-amber-400" />
                Unduh index.html
              </span>
              <Download className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-[11px] text-stone-400">File HTML utama template aplikasi</p>
          </button>

          {/* Button 2: Download Standalone HTML */}
          <button
            onClick={handleDownloadStandaloneHtml}
            className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-left space-y-1 transition-all border border-stone-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                Unduh Standalone HTML
              </span>
              <Download className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-[11px] text-stone-400">Web utuh siap buka offline di browser HP</p>
          </button>

          {/* Button 3: Download JSON Backup */}
          <button
            onClick={handleDownloadBackup}
            className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-left space-y-1 transition-all border border-stone-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                Unduh JSON Backup
              </span>
              <Download className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-[11px] text-stone-400">Cadangan seluruh ({products.length}) produk &amp; setting</p>
          </button>
        </div>
      </div>

      {/* Code Block Viewer for index.html */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-stone-100 text-base flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Blok Kode File index.html Terbaru
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Struktur HTML entry point aplikasi lengkap dengan meta tag dan font:
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? "Tersalin!" : "Salin HTML"}</span>
            </button>
            <button
              onClick={handleDownloadIndexHtml}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-white text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        <div className="relative rounded-xl bg-stone-950 border border-stone-800 p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-64 leading-relaxed">
          <pre>{rawIndexHtml}</pre>
        </div>
      </div>

      {/* Supabase Schema SQL Viewer */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-stone-100 text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Skema Database Supabase PostgreSQL
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Salin query SQL berikut jika ingin menghubungkan ke Supabase Cloud:
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? "SQL Disalin!" : "Salin SQL"}</span>
          </button>
        </div>

        <div className="relative rounded-xl bg-stone-950 border border-stone-800 p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-56 leading-relaxed">
          <pre>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      </div>

    </div>
  );
};

