import React, { useState } from "react";
import { LayoutDashboard, Package, PlusCircle, Settings, LogOut, Eye, Database, Shield, ChevronRight } from "lucide-react";
import type { Product, SiteSettings } from "../../types.ts";
import { AdminDashboard } from "./AdminDashboard.tsx";
import { AdminProducts } from "./AdminProducts.tsx";
import { AdminProductForm } from "./AdminProductForm.tsx";
import { AdminSettings } from "./AdminSettings.tsx";
import { AdminSupabaseGuide } from "./AdminSupabaseGuide.tsx";
import { AdminSecurity } from "./AdminSecurity.tsx";

interface AdminLayoutProps {
  products: Product[];
  settings: SiteSettings;
  token: string;
  onRefresh: () => Promise<void>;
  onLogout: () => void;
  onCloseAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  products,
  settings,
  token,
  onRefresh,
  onLogout,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("edit-product");
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setActiveTab("add-product");
  };

  const handleFormSuccess = async () => {
    await onRefresh();
    setEditingProduct(null);
    setActiveTab("products");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-800 bg-stone-900/60 shrink-0 p-5 justify-between">
        
        {/* Brand & Title */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Store Logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-stone-700 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-950 font-black flex items-center justify-center font-display text-sm">
                KV
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-stone-100 text-sm truncate">
                {settings.store_name || "KICKS VAULT"}
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-medium text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeTab === "dashboard" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Produk ({products.length})</span>
              </div>
              {activeTab === "products" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleAddProduct}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "add-product" || activeTab === "edit-product"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Produk</span>
              </div>
              {(activeTab === "add-product" || activeTab === "edit-product") && (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Pengaturan Web</span>
              </div>
              {activeTab === "settings" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("supabase")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "supabase"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Database / Backup</span>
              </div>
              {activeTab === "supabase" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-stone-100 text-stone-950 font-bold shadow"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>Ganti Password</span>
              </div>
              {activeTab === "security" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </nav>
        </div>

        {/* Bottom Actions: View Store & Logout */}
        <div className="space-y-2 pt-6 border-t border-stone-800">
          <button
            onClick={onCloseAdmin}
            className="w-full px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-400" />
            <span>Lihat Website Toko</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-900/40 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        
        {/* Top Mobile/Tablet Header */}
        <header className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm text-stone-100 md:hidden">
              {settings.store_name || "KICKS VAULT"}
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              Admin Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCloseAdmin}
              className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Halaman Customer</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 md:px-2.5 md:py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Content View */}
        <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <AdminDashboard
              products={products}
              settings={settings}
              onNavigate={(tab) => setActiveTab(tab)}
              onEditProduct={handleEditProduct}
              onAddProduct={handleAddProduct}
            />
          )}

          {activeTab === "products" && (
            <AdminProducts
              products={products}
              settings={settings}
              token={token}
              onRefresh={onRefresh}
              onEditProduct={handleEditProduct}
              onAddProduct={handleAddProduct}
            />
          )}

          {(activeTab === "add-product" || activeTab === "edit-product") && (
            <AdminProductForm
              productToEdit={editingProduct}
              token={token}
              onSuccess={handleFormSuccess}
              onCancel={() => setActiveTab("products")}
            />
          )}

          {activeTab === "settings" && (
            <AdminSettings
              settings={settings}
              token={token}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === "supabase" && (
            <AdminSupabaseGuide
              products={products}
              settings={settings}
              token={token}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === "security" && (
            <AdminSecurity token={token} />
          )}
        </main>
      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "dashboard" ? "text-stone-100 font-bold" : "text-stone-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "products" ? "text-stone-100 font-bold" : "text-stone-500"
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px]">Produk</span>
        </button>

        <button
          onClick={handleAddProduct}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "add-product" || activeTab === "edit-product" ? "text-amber-400 font-bold" : "text-stone-500"
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px]">Tambah</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "settings" ? "text-stone-100 font-bold" : "text-stone-500"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Pengaturan</span>
        </button>

        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px]">Logout</span>
        </button>
      </div>

    </div>
  );
};
