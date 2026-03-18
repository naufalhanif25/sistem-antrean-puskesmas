"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { set } from "zod";

export default function LoginForm() {
    const router = useRouter();

    const [nip, setNip] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"ADMIN" | "DOKTER" | "LAYAR">("ADMIN");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDark, setIsDark] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nip, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                // setError(data.error || "Login gagal");
                showToast(data.error || "Login gagal", "error");
                return;
            }

            showToast("Login berhasil!", "success");

            setTimeout(() => {
                if (data.role === "ADMIN") {
                    router.push("/admin");
                } else if (data.role === "DOKTER") {
                    router.push("/dokter");
                } else if (data.role === "LAYAR") {
                    router.push("/layar");
                }
            }, 500);
        } catch {
            // setError("Terjadi kesalahan saat login");
            showToast("Terjadi kesalahan saat login", "error");
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
                    Autentikasi Pengguna
                </h1>

                <p
                    className="text-sm tracking-widest transition-colors duration-300"
                    style={{
                        color: isDark ? "#9CA3AF" : "#6B7280",
                    }}
                >
                    PORTAL AKSES AMAN
                </p>
            </div>

            <div
                className="w-full max-w-md rounded-2xl p-8 transition-all duration-300"
                style={{
                    backgroundColor: isDark ? "#1A1A1A" : "#F9FAFB",
                    border: isDark ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                }}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                border: isDark
                                    ? "1px solid #2A2A2A"
                                    : "1px solid #D1D5DB",
                                color: isDark ? "#FFFFFF" : "#111827",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-2 text-sm font-medium transition-colors duration-300"
                            style={{
                                color: isDark ? "#D1D5DB" : "#4B5563",
                            }}
                        >
                            Kata sandi
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
                                border: isDark
                                    ? "1px solid #2A2A2A"
                                    : "1px solid #D1D5DB",
                                color: isDark ? "#FFFFFF" : "#111827",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="block mb-3 text-sm font-medium transition-colors duration-300"
                            style={{
                                color: isDark ? "#D1D5DB" : "#4B5563",
                            }}
                        >
                            Masuk sebagai
                        </label>

                        <div className="flex gap-3">
                            {(["ADMIN", "DOKTER", "LAYAR"] as const).map((r) => (
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
                                    {r === "ADMIN" ? "Admin" : r === "DOKTER" ? "Dokter" : "Layar"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div
                            className="rounded-lg p-3 text-sm transition-colors duration-300"
                            style={{
                                backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                                border: isDark
                                    ? "1px solid #DC2626"
                                    : "1px solid #FECACA",
                                color: isDark ? "#FCA5A5" : "#DC2626",
                            }}
                        >
                            {error}
                        </div>
                    )}

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
                            color: "#FFFFFF",
                        }}
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => router.push("/daftar")}
                        className="text-sm transition-colors duration-300 underline"
                        style={{
                            color: isDark ? "#9CA3AF" : "#6B7280",
                        }}
                    >
                        Belum punya akun? Daftar
                    </button>
                </div>

                <p
                    className="mt-6 text-center text-xs transition-colors duration-300"
                    style={{
                        color: isDark ? "#6B7280" : "#9CA3AF",
                    }}
                >
                    Akses tanpa izin dilarang. Tindakan Anda mungkin akan dicatat.
                </p>
            </div>

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