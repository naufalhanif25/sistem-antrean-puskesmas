"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "DOKTER">("ADMIN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nip, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      router.push(role === "ADMIN" ? "/admin" : "/dokter");
    } catch {
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
      }}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 p-2 rounded-lg transition-all duration-300 hover:scale-110"
        aria-label="Toggle dark mode"
      >
        <svg
          className="w-6 h-6 transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isDark ? "#1F1F1F" : "#F3F4F6",
          }}
        >
          <svg
            className="w-10 h-10 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: isDark ? "#E5E7EB" : "#374151",
            }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1
          className="text-3xl font-bold mb-1 transition-colors duration-300"
          style={{
            color: isDark ? "#FFFFFF" : "#111827",
          }}
        >
          Admin Sign In
        </h1>
        <p
          className="text-sm tracking-widest transition-colors duration-300"
          style={{
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}
        >
          SECURE ACCESS PORTAL
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 transition-all duration-300"
        style={{
          backgroundColor: isDark ? "#1A1A1A" : "#F9FAFB",
          border: isDark ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NIP */}
          <div>
            <label
              className="block mb-2 text-sm font-medium transition-colors duration-300"
              style={{
                color: isDark ? "#D1D5DB" : "#4B5563",
              }}
            >
              Nomor Identitas Pegawai (NIP)
            </label>
            <input
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Masukkan NIP Anda"
              required
              className="w-full rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                border: isDark ? "1px solid #2A2A2A" : "1px solid #D1D5DB",
                color: isDark ? "#FFFFFF" : "#111827",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block mb-2 text-sm font-medium transition-colors duration-300"
              style={{
                color: isDark ? "#D1D5DB" : "#4B5563",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password Anda"
              required
              className="w-full rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                border: isDark ? "1px solid #2A2A2A" : "1px solid #D1D5DB",
                color: isDark ? "#FFFFFF" : "#111827",
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label
              className="block mb-3 text-sm font-medium transition-colors duration-300"
              style={{
                color: isDark ? "#D1D5DB" : "#4B5563",
              }}
            >
              Role
            </label>
            <div className="flex gap-3">
              {(["ADMIN", "DOKTER"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="flex-1 rounded-lg py-3 font-medium transition-all duration-300"
                  style={{
                    backgroundColor:
                      role === r
                        ? isDark
                          ? "#313337"
                          : "#FFFFFF"
                        : isDark
                        ? "#0D0D0D"
                        : "#FFFFFF",
                    border:
                      role === r
                        ? isDark
                          ? "1px solid #404145"
                          : "1px solid #DC2626"
                        : isDark
                        ? "1px solid #2A2A2A"
                        : "1px solid #D1D5DB",
                    color:
                      role === r
                        ? isDark
                          ? "#FFFFFF"
                          : "#DC2626"
                        : isDark
                        ? "#9CA3AF"
                        : "#6B7280",
                    boxShadow:
                      role === r && !isDark
                        ? "0 1px 3px 0 rgba(220, 38, 38, 0.1), 0 1px 2px -1px rgba(220, 38, 38, 0.1)"
                        : "none",
                  }}
                >
                  {r === "ADMIN" ? "Admin" : "Dokter"}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-lg p-3 text-sm transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                border: isDark ? "1px solid #DC2626" : "1px solid #FECACA",
                color: isDark ? "#FCA5A5" : "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg py-3.5 font-medium transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              backgroundColor: isLoading
                ? isDark
                  ? "#2A2A2A"
                  : "#FCA5A5"
                : isDark
                ? "#313337"
                : "#DC2626",
              border: isDark
                ? isLoading
                  ? "1px solid #1F1F1F"
                  : "1px solid #404145"
                : "1px solid #DC2626",
              color: isLoading ? (isDark ? "#6B7280" : "#FFFFFF") : "#FFFFFF",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              boxShadow:
                !isLoading && !isDark
                  ? "0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -2px rgba(220, 38, 38, 0.2)"
                  : "none",
            }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <p
          className="mt-6 text-center text-xs transition-colors duration-300"
          style={{
            color: isDark ? "#6B7280" : "#9CA3AF",
          }}
        >
          Unauthorized access is prohibited. Your actions may be logged.
        </p>
      </div>

      {/* Footer */}
      <p
        className="mt-8 text-xs transition-colors duration-300"
        style={{
          color: isDark ? "#6B7280" : "#9CA3AF",
        }}
      >
        © 2025 Admin | Puskesmas Mesjid Raya
      </p>
    </div>
  );
}
