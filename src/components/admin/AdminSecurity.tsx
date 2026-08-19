import React, { useState } from "react";
import { Lock, KeyRound, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { api } from "../../lib/api.ts";

interface AdminSecurityProps {
  token: string;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({ token }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const curr = currentPassword.trim();
    const next = newPassword.trim();
    const conf = confirmPassword.trim();

    if (!curr) {
      setStatusMsg({ text: "Silakan masukkan password saat ini.", type: "error" });
      return;
    }

    if (next !== conf) {
      setStatusMsg({ text: "Konfirmasi password baru tidak cocok.", type: "error" });
      return;
    }

    if (next.length < 5) {
      setStatusMsg({ text: "Password baru minimal 5 karakter.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await api.changePassword(curr, next, token);
      setStatusMsg({ text: "Password admin berhasil diperbarui!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Gagal mengubah password", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      <div className="pb-4 border-b border-stone-800">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-100">
          Keamanan Akun Admin
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Ubah password login dashboard pengelola toko untuk menjaga keamanan katalog Anda.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-700 text-emerald-300"
              : "bg-rose-950/70 border border-rose-800 text-rose-300"
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

      <form noValidate onSubmit={handleSubmit} className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-stone-300">
            Password Saat Ini
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini (default: admin123)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-stone-300">
            Password Baru
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 5 karakter"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-stone-300">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Menyimpan Password..." : "Update Password Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};
