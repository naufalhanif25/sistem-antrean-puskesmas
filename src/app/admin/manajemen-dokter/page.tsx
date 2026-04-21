"use client";

import Sidebar from "@/app/components/Sidebar";
import { useState, useEffect } from "react";
import { AdminSidebarItems } from "@/app/data/sidebar";
import { showToast } from "@/lib/toast";
import { UserData } from "@/app/props/UserData";

export default function ManajemenDokterPage() {
    const [isDark, setIsDark] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [doctors, setDoctors] = useState<
        { id: number, cluster: number; doctorName: string }[]
    >([]);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/dokter");
            if (!res.ok) throw new Error("Gagal mengambil data");
            const data = await res.json();

            const doctorData = data.doctors.map((d) => ({
                id: d.id,
                cluster: d.cluster,
                doctorName: d.nama,
            })).sort((a, b) => a.cluster - b.cluster);

            setDoctors(doctorData);
        }
        catch (error) {
            showToast(error.message || "Gagal mengambil data dokter", "error");
        }
    };

    const getUserData = () => {
        const data = localStorage.getItem("user");
        if (!data) throw new Error("Gagal mengambil pengguna");
        setUserData(JSON.parse(data));
    };

    useEffect(() => {
        fetchData();
        getUserData();
    }, []);

    const handleHapus = async (id: number) => {
        try {
            await fetch(`/api/dokter/${id}`, {
                method: "DELETE",
                body: JSON.stringify({
                    role: userData.role
                })
            });

            fetchData();
            showToast("Dokter berhasil dihapus", "success");
        }
        catch (error) {
            showToast(error.message || "Gagal menghapus data dokter", "error");
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar isDark={isDark} items={AdminSidebarItems} />
            <div
                className="flex-1 overflow-y-auto transition-colors duration-300"
                style={{
                    backgroundColor: isDark ? "#0D0D0D" : "#F9FAFB",
                }}
            >
                <div className="flex items-center justify-between p-6 pb-3">
                    <div>
                        <h1
                            className="text-3xl font-bold transition-colors duration-300"
                            style={{
                                color: isDark ? "#FFFFFF" : "#111827",
                            }}
                        >
                            Manajemen Dokter
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
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
                                style={{
                                    color: isDark ? "#9CA3AF" : "#6B7280",
                                }}
                            >
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <div className="mb-6">
                        <p
                            className="text-sm transition-colors duration-300"
                            style={{
                                color: isDark ? "#9CA3AF" : "#6B7280",
                            }}
                        >
                            Kelola data dokter yang terdaftar saat ini, 
                            termasuk menghapus data dokter.
                        </p>
                    </div>
                    <div className="overflow-hidden transition-all duration-300 flex flex-col items-center justify-center gap-1">
                        {doctors.map((item, index) => {
                            return (
                                <div 
                                    className="w-full px-5 py-3 rounded-lg flex items-center justify-between w-full h-fit" 
                                    key={index}
                                    style={{
                                        backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
                                    }}
                                >
                                    <span className="flex items-center justify-center w-fit h-fit gap-4">
                                        <p
                                            className="text-md opacity-50"
                                            style={{
                                                color: isDark ? "#9CA3AF" : "#6B7280",
                                            }}
                                        >
                                            {index + 1}
                                        </p>
                                        <span className="flex flex-col items-start justify-center">
                                            <h2 
                                                className="text-md"
                                                style={{
                                                    color: isDark ? "#FFFFFF" : "#111827",
                                                }}
                                            >
                                                {item.doctorName}
                                            </h2>
                                            <h3
                                                className="text-sm"
                                                style={{
                                                    color: isDark ? "#9CA3AF" : "#6B7280",
                                                }}
                                            >
                                                Cluster {item.cluster}
                                            </h3>
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-center w-fit h-fit gap-2">
                                        <button
                                            onClick={() => handleHapus(item.id)}
                                            className="px-6 py-2 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-lg text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    isDark
                                                        ? "#7F1D1D"
                                                        : "#FEE2E2",
                                                color: isDark
                                                    ? "#FCA5A5"
                                                    : "#DC2626",
                                                border: isDark
                                                    ? "1px solid #991B1B"
                                                    : "1px solid #DC2626"
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}