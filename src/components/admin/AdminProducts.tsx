import React, { useState } from "react";
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import type { Product, SiteSettings } from "../../types.ts";
import { formatIDR, api } from "../../lib/api.ts";

interface AdminProductsProps {
  products: Product[];
  settings: SiteSettings;
  token: string;
  onRefresh: () => Promise<void>;
  onEditProduct: (product: Product) => void;
  onAddProduct: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  settings,
  token,
  onRefresh,
  onEditProduct,
  onAddProduct
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.size.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === "available" ? "sold" : "available";
    setLoadingAction(product.id);
    try {
      await api.updateProduct(product.id, { status: nextStatus }, token);
      await onRefresh();
      setStatusMsg({
        text: `Status ${product.name} diubah menjadi ${nextStatus === "available" ? "TERSEDIA" : "TERJUAL"}.`,
        type: "success"
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Gagal mengubah status", type: "error" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteProduct(id, token);
      await onRefresh();
      setStatusMsg({ text: `Produk "${name}" berhasil dihapus.`, type: "success" });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Gagal menghapus produk", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
            Daftar Produk & Stok
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola data katalog sepatu, ubah status ketersediaan, atau perbarui harga.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddProduct}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Status Message Notification */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
              : "bg-rose-950/60 border border-rose-800 text-rose-300"
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

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, brand, ukuran sepatu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs shrink-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "all" ? "bg-stone-800 text-white font-bold" : "text-stone-400"
            }`}
          >
            Semua ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter("available")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "available" ? "bg-emerald-900/80 text-emerald-300 font-bold" : "text-stone-400"
            }`}
          >
            Tersedia ({products.filter((p) => p.status === "available").length})
          </button>
          <button
            onClick={() => setStatusFilter("sold")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "sold" ? "bg-stone-800 text-stone-300 font-bold" : "text-stone-400"
            }`}
          >
            Terjual ({products.filter((p) => p.status === "sold").length})
          </button>
        </div>
      </div>

      {/* Products Table/Card View */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((product) => {
            const isSold = product.status === "sold";
            const isLoadingThis = loadingAction === product.id || deletingId === product.id;

            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-stone-700 transition-all"
              >
                {/* Left: Product Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${isSold ? "grayscale opacity-60" : ""}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                        {product.brand}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        Size: <strong className="text-stone-200">{product.size}</strong>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-stone-100 text-base sm:text-lg leading-snug mt-1 truncate">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                      <span className="font-mono font-bold text-emerald-400">
                        {formatIDR(product.price)}
                      </span>
                      <span className="text-stone-500 font-mono">• {product.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                  {/* Status Toggle Button */}
                  <button
                    disabled={isLoadingThis}
                    onClick={() => handleToggleStatus(product)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSold
                        ? "bg-stone-800 hover:bg-emerald-950 text-stone-400 hover:text-emerald-300 border border-stone-700"
                        : "bg-emerald-950/80 hover:bg-stone-800 text-emerald-300 hover:text-stone-300 border border-emerald-800/60"
                    }`}
                    title="Klik untuk mengubah status ketersediaan"
                  >
                    {isSold ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>TERJUAL (Ubah Ready)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>TERSEDIA (Ubah Sold)</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onEditProduct(product)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    disabled={isLoadingThis}
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 p-8 space-y-3">
          <p className="text-stone-400 text-sm">Tidak ada produk yang cocok dengan pencarian.</p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="text-xs font-mono text-amber-400 underline cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

    </div>
  );
};
