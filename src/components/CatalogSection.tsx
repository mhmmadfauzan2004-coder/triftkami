import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from "lucide-react";
import type { Product, SiteSettings } from "../types.ts";
import { ProductCard } from "./ProductCard.tsx";

interface CatalogSectionProps {
  products: Product[];
  settings: SiteSettings;
  onSelectProduct: (product: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  settings,
  onSelectProduct
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "available" | "sold">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [selectedSize, setSelectedSize] = useState("ALL");

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand.trim());
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [products]);

  // Extract common sizes
  const sizes = useMemo(() => {
    const sizeOptions = ["ALL", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45"];
    return sizeOptions;
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const matchesSearch =
          searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

        // Brand
        const matchesBrand =
          selectedBrand === "ALL" ||
          p.brand.toLowerCase() === selectedBrand.toLowerCase();

        // Status
        const matchesStatus =
          selectedStatus === "all" || p.status === selectedStatus;

        // Size
        const matchesSize =
          selectedSize === "ALL" ||
          p.size.includes(selectedSize);

        return matchesSearch && matchesBrand && matchesStatus && matchesSize;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, searchQuery, selectedBrand, selectedStatus, selectedSize, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("ALL");
    setSelectedStatus("all");
    setSelectedSize("ALL");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedBrand !== "ALL" ||
    selectedStatus !== "all" ||
    selectedSize !== "ALL" ||
    sortBy !== "newest";

  return (
    <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-stone-100 rounded-sm rotate-45" />
            <p className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
              Curated Inventory
            </p>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-100 tracking-tight mt-1.5">
            Katalog Sepatu Second
          </h2>
          <p className="text-stone-400 text-sm mt-1 max-w-xl">
            Pilihan sneaker original terawat siap bungkus. Klik pada item untuk melihat detail kondisi lengkap atau langsung order via WhatsApp.
          </p>
        </div>

        {/* Quick status count badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            Total: <strong className="text-white">{products.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-400">
            Ready: <strong className="text-emerald-300">{products.filter(p => p.status === "available").length}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="pt-6 pb-8 space-y-4">
        
        {/* Search Input & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama sepatu, brand, ukuran (contoh: Jordan, Dunk, 42)..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-stone-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-4 relative">
            <div className="flex items-center gap-2 h-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-3 px-3.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-sm focus:outline-none focus:border-stone-500 cursor-pointer"
              >
                <option value="newest">Terbaru Ditambahkan</option>
                <option value="price-asc">Harga Terendah (Termurah)</option>
                <option value="price-desc">Harga Tertinggi (Sultan/Grail)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-mono text-stone-500 uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Brand:
          </span>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                selectedBrand.toLowerCase() === brand.toLowerCase()
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Secondary Filter: Availability & Sizes */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Availability Status Filter */}
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === "all" ? "bg-stone-800 text-white font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setSelectedStatus("available")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === "available" ? "bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-700/50" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Tersedia ({products.filter(p => p.status === "available").length})
            </button>
            <button
              onClick={() => setSelectedStatus("sold")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedStatus === "sold" ? "bg-stone-800 text-stone-300 font-semibold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Terjual ({products.filter(p => p.status === "sold").length})
            </button>
          </div>

          {/* Size Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[11px] font-mono text-stone-500 uppercase mr-1">Size:</span>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  selectedSize === s
                    ? "bg-stone-200 text-stone-950 font-bold"
                    : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reset Filters Trigger */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl bg-stone-900/50 border border-dashed border-stone-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-200">Sepatu Tidak Ditemukan</h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto mt-1">
              Tidak ada sepatu yang cocok dengan filter atau kata kunci &ldquo;{searchQuery}&rdquo;. Coba reset filter atau tanyakan langsung ke admin.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-stone-100 text-stone-950 font-bold text-xs hover:bg-white transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </section>
  );
};
