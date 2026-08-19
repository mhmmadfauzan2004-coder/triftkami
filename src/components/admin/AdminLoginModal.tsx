import React, { useState } from "react";
import { Lock, User, KeyRound, X, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { api } from "../../lib/api.ts";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, username: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(username, password);
      onLoginSuccess(res.token, res.username);
      onClose();
    } catch (err: any) {
      setError(err.message || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto text-stone-100 shadow-inner">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-display font-extrabold text-stone-100">
            Login Admin Toko
          </h2>
          <p className="text-xs text-stone-400">
            Akses dashboard untuk mengelola katalog sepatu, harga, stok, dan pengaturan toko.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-stone-300">
              Username Admin
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-stone-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Demo default credentials reminder box */}
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 text-[11px] font-mono flex items-center justify-between">
            <span>Default: admin / admin123</span>
            <button
              type="button"
              onClick={() => {
                setUsername("admin");
                setPassword("admin123");
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Isi Otomatis
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Masuk Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
