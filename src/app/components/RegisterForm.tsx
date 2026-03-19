"use client";

import Sidebar from "./Sidebar";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { PasswordInput, UserRole } from "../props/UserData";
import { EyeOff, Eye } from "lucide-react";

export default function RegisterForm() {
    const [nip, setNip] = useState("");
    const [nama, setNama] = useState("");
    const [passwordInput, setPasswordInput] = useState<PasswordInput>("password");
    const [password, setPassword] = useState("");
    const [cluster, setCluster] = useState<number>(1);
    const role: UserRole = "DOKTER";
    const [isLoading, setIsLoading] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nip, nama, password, role, cluster }),
            });
            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || "Registrasi gagal", "error");
                return;
            }
            showToast("Registrasi berhasil!", "success");
        } catch (error) {
            showToast(error.message || "Terjadi kesalahan saat registrasi", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar isDark={isDark} />
            <div
                className="flex-1 overflow-y-auto transition-colors duration-300"
                style={{ backgroundColor: isDark ? "#0D0D0D" : "#F9FAFB" }}
            >
                <div className="flex items-center justify-between p-6 pb-3">
                    <div>
                        <h1
                            className="text-3xl font-bold transition-colors duration-300"
                            style={{
                                color: isDark ? "#FFFFFF" : "#111827",
                            }}
                        >
                            Registrasi Dokter
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{
                            backgroundColor: isDark ? "#1F1F1F" : "#FFFFFF",
                            border: isDark
                                ? "1px solid #2A2A2A"
                                : "1px solid #E5E7EB",
                        }}
                    >
                        <svg
                            className="w-5 h-5 transition-colors duration-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
                        >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 pb-6">
                    <div className="mb-6">
                        <p
                            className="text-sm transition-colors duration-300"
                            style={{
                                color: isDark ? "#9CA3AF" : "#6B7280",
                            }}
                        >
                            Form untuk mendaftarkan akun dokter baru ke dalam sistem sesuai cluster yang ditentukan.
                        </p>
                    </div>
                    <div className="max-w-xl mx-auto flex items-center justify-center min-h-[calc(100vh-220px)]">
                        <div
                            className="w-full rounded-2xl p-8 transition-all duration-300"
                            style={{
                                backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                                border: isDark
                                    ? "1px solid #2A2A2A"
                                    : "1px solid #E5E7EB",
                            }}
                        >
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
                                    style={{
                                        backgroundColor: isDark
                                            ? "#0D0D0D"
                                            : "#F3F4F6",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
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
                                        style={{ color: isDark ? "#E5E7EB" : "#374151" }}
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <h2
                                className="text-2xl font-bold text-center mb-8"
                                style={{
                                    color: isDark ? "#FFFFFF" : "#111827",
                                }}
                            >
                                Tambah Dokter
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-medium transition-colors duration-300"
                                        style={{ color: isDark ? "#D1D5DB" : "#4B5563" }}
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
                                        style={{ color: isDark ? "#D1D5DB" : "#4B5563" }}
                                    >
                                        Nama
                                    </label>
                                    <input
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        placeholder="Masukkan Nama Anda"
                                        required={role === "DOKTER"}
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
                                        style={{ color: isDark ? "#D1D5DB" : "#4B5563" }}
                                    >
                                        Kata sandi
                                    </label>
                                    <div className="flex gap-2 items-center justify-center">
                                        <input
                                            type={passwordInput}
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
                                        <button 
                                            type="button"
                                            onClick={() => setPasswordInput(passwordInput == "password" ? "text" : "password")}
                                            className="rounded-lg px-4 py-3 w-fit flex items-center justify-center"
                                            style={{
                                                backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                                                border: isDark
                                                    ? "1px solid #2A2A2A"
                                                    : "1px solid #D1D5DB",
                                                color: isDark ? "#FFFFFF" : "#111827",
                                            }}
                                        >
                                            {passwordInput == "password" ? (
                                                <Eye 
                                                    size={24} 
                                                    strokeWidth={1} 
                                                    color={isDark ? "#FFFFFF" : "#111827"} 
                                                />
                                            ): (
                                                <EyeOff 
                                                    size={24} 
                                                    strokeWidth={1} 
                                                    color={isDark ? "#FFFFFF" : "#111827"} 
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-medium transition-colors duration-300"
                                        style={{ color: isDark ? "#D1D5DB" : "#4B5563" }}
                                    >
                                        Cluster Dokter
                                    </label>
                                    <select
                                        value={cluster}
                                        onChange={(e) => setCluster(Number(e.target.value))}
                                        className="w-full rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 appearance-none bg-no-repeat"
                                        style={{
                                            backgroundColor: isDark
                                                ? "#0D0D0D"
                                                : "#FFFFFF",
                                            border: isDark
                                                ? "1px solid #2A2A2A"
                                                : "1px solid #D1D5DB",
                                            color: cluster
                                                ? isDark
                                                    ? "#FFFFFF"
                                                    : "#111827"
                                                : "#9CA3AF",
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                                                isDark
                                                    ? "%239CA3AF"
                                                    : "%236B7280"
                                            }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundSize: "1rem",
                                            backgroundPosition:
                                                "right 0.75rem center",
                                            paddingRight: "2.5rem",
                                        }}
                                    >
                                        <option value="" disabled>
                                            Pilih Cluster
                                        </option>
                                        <option value={1}>
                                            Cluster 1
                                        </option>
                                        <option value={2}>
                                            Cluster 2
                                        </option>
                                        <option value={3}>
                                            Cluster 3
                                        </option>
                                        <option value={4}>
                                            Cluster 4
                                        </option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-lg py-3.5 font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: isLoading
                                            ? isDark
                                                ? "#2A2A2A"
                                                : "#FCA5A5"
                                            : isDark
                                            ? "#313337"
                                            : "#DC2626",
                                        border: isDark
                                            ? "1px solid #404145"
                                            : "1px solid #DC2626",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {isLoading ? "Memproses..." : "Daftar"}
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <p
                                    className="mt-6 text-center text-xs transition-colors duration-300"
                                    style={{
                                        color: isDark ? "#6B7280" : "#9CA3AF",
                                    }}
                                >
                                    Akses tanpa izin dilarang. Tindakan Anda mungkin akan
                                    dicatat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
