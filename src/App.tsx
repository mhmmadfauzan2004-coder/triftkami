import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar.tsx";
import { HeroSection } from "./components/HeroSection.tsx";
import { CatalogSection } from "./components/CatalogSection.tsx";
import { ProductDetailModal } from "./components/ProductDetailModal.tsx";
import { StoreInfoSection } from "./components/StoreInfoSection.tsx";
import { Footer } from "./components/Footer.tsx";
import { AdminLoginModal } from "./components/admin/AdminLoginModal.tsx";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";
import type { Product, SiteSettings, AuthState } from "./types.ts";
import { api, DEFAULT_SETTINGS } from "./lib/api.ts";
import { MessageCircle, Shield } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [auth, setAuth] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem("kv_admin_token");
    const savedUser = localStorage.getItem("kv_admin_user");
    return {
      isAuthenticated: !!savedToken,
      token: savedToken,
      username: savedUser
    };
  });

  // Fetch products and settings from API
  const fetchData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedProducts] = await Promise.all([
        api.getSettings(),
        api.getProducts()
      ]);
      setSettings(fetchedSettings);
      setProducts(fetchedProducts);
      // Cache locally for offline reliability
      localStorage.setItem("kv_settings_cache", JSON.stringify(fetchedSettings));
      localStorage.setItem("kv_products_cache", JSON.stringify(fetchedProducts));
    } catch (err) {
      console.error("Error fetching store data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check auth validity on mount
  useEffect(() => {
    if (auth.token) {
      api.verifyToken(auth.token).then((isValid) => {
        if (!isValid) {
          handleLogout();
        }
      });
    }
  }, [auth.token]);

  const handleLoginSuccess = (token: string, username: string) => {
    localStorage.setItem("kv_admin_token", token);
    localStorage.setItem("kv_admin_user", username);
    setAuth({
      isAuthenticated: true,
      token,
      username
    });
    setIsAdminView(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("kv_admin_token");
    localStorage.removeItem("kv_admin_user");
    setAuth({
      isAuthenticated: false,
      token: null,
      username: null
    });
    setIsAdminView(false);
  };

  const handleOpenAdminTrigger = () => {
    if (auth.isAuthenticated) {
      setIsAdminView(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // If viewing admin dashboard
  if (isAdminView && auth.isAuthenticated && auth.token) {
    return (
      <AdminLayout
        products={products}
        settings={settings}
        token={auth.token}
        onRefresh={fetchData}
        onLogout={handleLogout}
        onCloseAdmin={() => setIsAdminView(false)}
      />
    );
  }

  const availableCount = products.filter((p) => p.status === "available").length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-stone-100 selection:text-stone-950">
      
      {/* Loading state indicator */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-2 border-stone-700 border-t-stone-100 rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-stone-400 uppercase">
            Loading Kicks Vault...
          </p>
        </div>
      )}

      {/* Customer Header / Navbar */}
      <Navbar
        settings={settings}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={auth.isAuthenticated}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Hero Section */}
      <HeroSection
        settings={settings}
        onExploreClick={scrollToCatalog}
        totalAvailable={availableCount}
      />

      {/* Main Catalog Section */}
      <main className="flex-1">
        <CatalogSection
          products={products}
          settings={settings}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* Store Physical Location, Hours, & Legit Guarantee */}
        <StoreInfoSection settings={settings} />
      </main>

      {/* Customer Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Quick WhatsApp Button for Customer Convenience */}
      {settings.whatsapp_number && (
        <a
          href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${settings.store_name}, saya ingin tanya ketersediaan sepatu.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-stone-950 group"
          aria-label="Chat WhatsApp Admin"
          title="Tanya Admin via WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white/20" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Chat WhatsApp
          </span>
        </a>
      )}

    </div>
  );
}
