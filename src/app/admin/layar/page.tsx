"use client";

import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LayarPage() {
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();

    const handleBackToDashboard = () => {
        router.push("/admin/pendaftaran");
    };

    const handleDisplayNow = () => {
        router.push("/layar");
    };

    return (
        <div className="flex h-screen">
            <Sidebar isDark={isDark} />
            <div
                className="flex-1 min-h-screen w-full relative transition-colors duration-300 flex items-center justify-center overflow-y-auto"
                style={{
                    backgroundColor: isDark ? "#0D0D0D" : "#F9FAFB",
                }}
            >
                <div className="absolute top-6 right-6">
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
                <div
                    className="w-full max-w-md mx-4 rounded-2xl p-8 transition-colors duration-300 shadow-xl"
                    style={{
                        backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                        border: isDark
                            ? "1px solid #2A2A2A"
                            : "1px solid #E5E7EB",
                    }}
                >
                    <div className="flex justify-center mb-6">
                        <svg
                            className="w-24 h-24"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                color: isDark ? "#E5E7EB" : "#111827",
                            }}
                        >
                            <rect
                                x="2"
                                y="3"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                            />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <h2
                        className="text-2xl font-bold text-center mb-8 transition-colors duration-300"
                        style={{
                            color: isDark ? "#FFFFFF" : "#111827",
                        }}
                    >
                        Ingin Menampilkan Informasi Antrean?
                    </h2>

                    {/* Buttons */}
                    <div className="flex gap-3 flex-col sm:flex-row">
                        <button
                            onClick={handleBackToDashboard}
                            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center"
                            style={{
                                backgroundColor: isDark ? "#1F1F1F" : "#FFFFFF",
                                border: isDark
                                    ? "1px solid #2A2A2A"
                                    : "1px solid #D1D5DB",
                                color: isDark ? "#9CA3AF" : "#6B7280",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = isDark
                                    ? "#404145"
                                    : "#DC2626";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isDark
                                    ? "#2A2A2A"
                                    : "#D1D5DB";
                            }}
                        >
                            Kembali ke Dashboard
                        </button>
                        <button
                            onClick={handleDisplayNow}
                            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center"
                            style={{
                                backgroundColor: isDark ? "#313337" : "#DC2626",
                                color: "#FFFFFF",
                                border: isDark
                                    ? "1px solid #404145"
                                    : "1px solid #B91C1C",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#3A3D42"
                                    : "#B91C1C";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#313337"
                                    : "#DC2626";
                            }}
                        >
                            Tampilkan Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
