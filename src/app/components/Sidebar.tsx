"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { UserData } from "../props/UserData";

interface SidebarProps {
    userEmail?: string;
    userRole?: string;
    isDark?: boolean;
}

export default function Sidebar({
    isDark = false,
}: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
       try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (!res.ok) {
                showToast("Gagal logout", "error");
                return;
            }
            localStorage.removeItem("user");

            showToast("Berhasil logout", "success");
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 500);

        } catch (error) {
            showToast(error.message || "Terjadi kesalahan saat logout", "error");
        }
    };
    
    const getUserData = (setAction: (value: React.SetStateAction<UserData>) => void) => {
        const data = localStorage.getItem("user");
        if (!data) throw new Error("Gagal ambil pengguna");
        setAction(JSON.parse(data));
    };

    useEffect(() => {
        getUserData(setUserData);
    }, []);

    const menuItems = [
        {
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
            ),
            label: "Pendaftaran",
            href: "/admin/pendaftaran"
        },
        {
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 11h-6" />
                    <path d="M19 8v6" />
                </svg>
            ),
            label: "Daftar Antrean",
            href: "/admin/daftar-antrean"
        },
        {
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 11h-6" />
                    <path d="M19 8v6" />
                </svg>
            ),
            label: "Registrasi Dokter",
            href: "/admin/regis-dokter"
        },
        {
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
            ),
            label: "Layar",
            href: "/admin/layar"
        },
    ];

    return (
        <div
            className={`flex flex-col transition-all duration-300 ${
                isSidebarOpen ? "w-64" : "w-20"
            } overflow-hidden flex-shrink-0`}
            style={{
                backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                borderRight: isDark ? "1px solid #1F1F1F" : "1px solid #E5E7EB",
                height: "100vh",
            }}
        >
            <div
                className="p-6 transition-colors duration-300 flex items-start justify-between"
                style={{
                    borderBottom: isDark
                        ? "1px solid #1F1F1F"
                        : "1px solid #E5E7EB",
                    minHeight: isSidebarOpen ? "auto" : "80px",
                }}
            >
                {isSidebarOpen ? (
                    <>
                        <div>
                            <h1
                                className="text-xs font-bold text-nowrap uppercase tracking-widest transition-colors duration-300"
                                style={{
                                    color: isDark ? "#E5E7EB" : "#111827",
                                }}
                            >
                                Panel Admin
                            </h1>
                            <p
                                className="text-xs mt-1 transition-colors text-nowrap duration-300"
                                style={{
                                    color: isDark ? "#6B7280" : "#9CA3AF",
                                }}
                            >
                                Puskesmas Mesjid Raya
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 rounded-lg transition-all duration-300 flex-shrink-0"
                            style={{
                                color: isDark ? "#9CA3AF" : "#6B7280",
                                backgroundColor: isDark ? "#1A1A1A" : "#F3F4F6",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#262626"
                                    : "#E5E7EB";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#1A1A1A"
                                    : "#F3F4F6";
                            }}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1.5 rounded-lg transition-all duration-300 w-full flex justify-center"
                        style={{
                            color: isDark ? "#9CA3AF" : "#6B7280",
                            backgroundColor: isDark ? "#1A1A1A" : "#F3F4F6",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark
                                ? "#262626"
                                : "#E5E7EB";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark
                                ? "#1A1A1A"
                                : "#F3F4F6";
                        }}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>
            {isSidebarOpen && (
                <div className="px-4 pt-6 pb-4">
                    <h2
                        className="text-xl font-bold text-center transition-colors duration-300"
                        style={{
                            color: isDark ? "#FFFFFF" : "#111827",
                        }}
                    >
                        Dashboard
                    </h2>
                </div>
            )}
            <nav className="flex-1 overflow-y-auto px-4 pb-4">
                <div className={`${isSidebarOpen ? "space-y-2" : "space-y-3"}`}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;

                        return (
                            <a
                                key={index}
                                href={isActive ? null : item.href}
                                className={`flex items-center rounded-lg transition-all duration-300 group ${
                                    isSidebarOpen
                                        ? "gap-3 px-4 py-3"
                                        : "justify-center py-3"
                                }`}
                                style={{
                                    backgroundColor: isActive
                                        ? isDark
                                            ? "#1F1F1F"
                                            : "#F3F4F6"
                                        : "transparent",
                                    color: isActive
                                        ? isDark
                                            ? "#FFFFFF"
                                            : "#DC2626"
                                        : isDark
                                          ? "#9CA3AF"
                                          : "#6B7280",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor =
                                            isDark ? "#1A1A1A" : "#F9FAFB";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor =
                                            "transparent";
                                    }
                                }}
                                title={isSidebarOpen ? "" : item.label}
                            >
                                <span>{item.icon}</span>
                                {isSidebarOpen && (
                                    <span className="text-sm font-medium text-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </a>
                        );
                    })}
                </div>
            </nav>
            {isSidebarOpen && (
                <div
                    className="p-4 transition-colors duration-300"
                    style={{
                        borderTop: isDark
                            ? "1px solid #1F1F1F"
                            : "1px solid #E5E7EB",
                    }}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full flex items-center rounded-lg transition-all duration-300 ${
                            isSidebarOpen
                                ? "gap-3 px-4 py-3"
                                : "justify-center py-3"
                        }`}
                        style={{
                            backgroundColor: isOpen
                                ? isDark
                                    ? "#1F1F1F"
                                    : "#F3F4F6"
                                : "transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (!isOpen) {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#1A1A1A"
                                    : "#F9FAFB";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isOpen) {
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                            }
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 flex-shrink-0"
                            style={{
                                backgroundColor: isDark ? "#1F1F1F" : "#E5E7EB",
                                color: isDark ? "#E5E7EB" : "#374151",
                            }}
                        >
                            {(userData?.name || "Admin").at(0).toUpperCase()}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 text-left min-w-0">
                                <p
                                    className="text-xs truncate transition-colors duration-300"
                                    style={{
                                        color: isDark ? "#E5E7EB" : "#374151",
                                    }}
                                >
                                    {(userData?.name || "Admin")}
                                </p>
                                <p
                                    className="text-xs transition-colors duration-300"
                                    style={{
                                        color: isDark ? "#6B7280" : "#9CA3AF",
                                    }}
                                >
                                    {userData?.nip}
                                </p>
                            </div>
                        )}
                    </button>
                    {isOpen && (
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium"
                            style={{
                                color: isDark ? "#FCA5A5" : "#DC2626",
                                backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#991B1B"
                                    : "#FEE2E2";
                                e.currentTarget.style.opacity = "0.9";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark
                                    ? "#7F1D1D"
                                    : "#FEE2E2";
                                e.currentTarget.style.opacity = "1";
                            }}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
