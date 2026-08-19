import React from "react";
import { Package, CheckCircle2, XCircle, DollarSign, Plus, Settings, MessageSquare, ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import type { Product, SiteSettings } from "../../types.ts";
import { formatIDR } from "../../lib/api.ts";

interface AdminDashboardProps {
  products: Product[];
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
  onEditProduct: (product: Product) => void;
  onAddProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  settings,
  onNavigate,
  onEditProduct,
  onAddProduct
}) => {
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.status === "available");
  const soldProducts = products.filter((p) => p.status === "sold");

  const totalInventoryValue = availableProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const totalSoldValue = soldProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
            Overview Toko
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Status inventaris produk secondhand dan pengaturan aktif {settings.store_name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddProduct}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sepatu</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Total Produk</span>
            <div className="p-2 rounded-lg bg-stone-800 text-stone-200">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-display font-extrabold text-stone-100">{totalProducts}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Seluruh sneaker terdaftar</p>
          </div>
        </div>

        {/* Ready Stock / Available */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Produk Tersedia</span>
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-display font-extrabold text-emerald-400">{availableProducts.length}</p>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">Siap diorder customer</p>
          </div>
        </div>

        {/* Sold Out */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Produk Terjual</span>
            <div className="p-2 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-display font-extrabold text-stone-300">{soldProducts.length}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Status Sold Out</p>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Nilai Stok Aktif</span>
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-display font-extrabold text-amber-300">
              {formatIDR(totalInventoryValue)}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Estimasi aset ready stock</p>
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
        <h3 className="text-sm font-mono uppercase tracking-wider text-stone-400 font-bold mb-4">
          Akses Cepat Pengelolaan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate("add-product")}
            className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-600 text-left space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-sm group-hover:text-white">Tambah Produk Baru</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-xs text-stone-400">Upload foto sepatu, isi size, kondisi, dan harga.</p>
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-600 text-left space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-sm group-hover:text-white">Pengaturan WhatsApp & Store</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-xs text-stone-400">Ubah no WhatsApp, Instagram, judul landing page, & alamat.</p>
          </button>

          <button
            onClick={() => onNavigate("products")}
            className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-600 text-left space-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-sm group-hover:text-white">Kelola Status & Stok</span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
            </div>
            <p className="text-xs text-stone-400">Ubah status item menjadi Terjual / Tersedia dalam 1-klik.</p>
          </button>
        </div>
      </div>

      {/* Recent Inventory Table */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden">
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-stone-100 text-base">
            Produk Terbaru
          </h3>
          <button
            onClick={() => onNavigate("products")}
            className="text-xs font-mono text-stone-400 hover:text-stone-200 underline cursor-pointer"
          >
            Lihat Semua ({totalProducts})
          </button>
        </div>

        <div className="divide-y divide-stone-800 overflow-x-auto">
          {recentProducts.map((p) => (
            <div
              key={p.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.image_url}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-stone-950 shrink-0 border border-stone-800"
                />
                <div className="min-w-0">
                  <p className="font-bold text-stone-100 text-sm truncate">{p.name}</p>
                  <p className="text-xs font-mono text-stone-400">
                    {p.brand} • Size {p.size} • {p.condition}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="font-mono font-bold text-stone-100 text-sm">{formatIDR(p.price)}</p>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      p.status === "available"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {p.status === "available" ? "TERSEDIA" : "TERJUAL"}
                  </span>
                </div>

                <button
                  onClick={() => onEditProduct(p)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
