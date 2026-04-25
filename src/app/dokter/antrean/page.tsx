"use client";

import { useState, useEffect, useCallback } from "react";
import { QueueItem, UserData } from "@/app/props/UserData";
import Sidebar from "@/app/components/Sidebar";
import { showToast } from "@/lib/toast";
import { DokterSidebarItems } from "@/app/data/sidebar";

export default function AntreanPage() {
    const [isDark, setIsDark] = useState(false);
    const [isRefreshHovered, setIsRefreshHovered] = useState(false);
    const [isPreviousHovered, setIsPreviousHovered] = useState(false);
    const [isNextHovered, setIsNextHovered] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [queueData, setQueueData] = useState<QueueItem[]>([]);
    const [queueIndex, setQueueIndex] = useState<number>(0);

    const fetchData = async (currentData: UserData | null) => {
        try {
            const res = await fetch(`/api/antrean/${currentData?.cluster || 1}/dokter`);
            if (!res.ok) throw new Error("Gagal ambil data");
            const data = await res.json();
    
            setQueueData(data.queue || []);
        } catch (error) {
            showToast(error.message || "Gagal ambil data antrean", "error");
        }
    };

    const getUserData = () => {
        const data = localStorage.getItem("user");
        if (!data) throw new Error("Gagal ambil pengguna");
        setUserData(JSON.parse(data));
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        fetchData(userData);
    }, [userData]);

    const maxIndex = queueData.length - 1;

    const handleRefresh = useCallback(() => {
        fetchData(userData);
        showToast("Data berhasil direfresh");
    }, [userData]);

    const speechGenerator = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        speechSynthesis.speak(utterance);
    };

    const handlePanggil = useCallback(async (id: number) => {
        try {
            const res = await fetch(`/api/antrean/${id}/${"Dipanggil"}`, {
                method: "PUT",
                body: JSON.stringify({
                    role: userData.role
                })
            });
            const result = await res.json();
            fetchData(userData);

            if (result?.nomorDisplay) {                
                speechGenerator(`Nomor antrean ${result.nomorDisplay}`);
                showToast(`Memanggil nomor ${result.nomorDisplay}`, "success");
            } else {
                showToast("Berhasil memanggil antrean", "success");
            }
        } catch (error) {
            showToast(error.message || "Terjadi kesalahan", "error");
        }
    }, [userData]);

    const handleLewati = useCallback(async (id: number) => {
        try {
            const res = await fetch(`/api/antrean/${id}/${"Menunggu"}`, {
                method: "PUT",
                body: JSON.stringify({
                    role: userData.role
                })
            });
            const result = await res.json();
            fetchData(userData);

            if (result?.nomorDisplay) {
                showToast(`Nomor ${result.nomorDisplay} dilewati`, "success");
            } else {
                showToast("Antrean dilewati", "success");
            }
        } catch (error) {
            showToast(error.message || "Gagal lewati antrean", "error");
        }
    }, [userData]);

    const handlePeriksa = useCallback(async (id: number) => {
        try {
            const res = await fetch(`/api/antrean/${id}/${"Sedang Diperiksa"}`, {
                method: "PUT",
                body: JSON.stringify({
                    role: userData.role
                })
            });
            const result = await res.json();
            fetchData(userData);

            if (result?.nomorDisplay) {
                showToast(`Nomor ${result.nomorDisplay} selesai`, "success");
            } else {
                showToast("Antrean selesai", "success");
            }
        } catch (error) {
            showToast(error.message || "Gagal menyelesaikan antrean", "error");
        }
    }, [userData]);

    const handleSelesai = useCallback(async (id: number) => {
        try {
            const res = await fetch(`/api/antrean/${id}/${"Selesai"}`, {
                method: "PUT",
                body: JSON.stringify({
                    role: userData.role
                })
            });
            const result = await res.json();
            fetchData(userData);

            if (result?.nomorDisplay) {
                showToast(`Nomor ${result.nomorDisplay} selesai`, "success");
            } else {
                showToast("Antrean selesai", "success");
            }
        } catch (error) {
            showToast(error.message || "Gagal menyelesaikan antrean", "error");
        }
    }, [userData]);

    const getStatusColor = useCallback(
        (status: string) => {
            switch (status) {
                case "Dipanggil":
                    return isDark ? "#047857" : "#10B981";
                case "Menunggu":
                    return isDark ? "#991B1B" : "#DC2626";
                case "Sedang Diperiksa":
                    return isDark ? "#D97706" : "#F59E0B";
                case "Selesai":
                    return isDark ? "#1E3A8A" : "#93C5FD";
                default:
                    return isDark ? "#991B1B" : "#DC2626";
            }
        }, 
        [isDark]
    );

    return (
        <div className="flex h-screen">
            <Sidebar isDark={isDark} items={DokterSidebarItems} title="Panel Dokter" />
            <div
                className="flex-1 overflow-y-auto transition-colors duration-300 flex flex-col"
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
                            Antrean Terkini
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            onMouseEnter={() => setIsRefreshHovered(true)}
                            onMouseLeave={() => setIsRefreshHovered(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                            style={{
                                backgroundColor: isRefreshHovered
                                    ? isDark
                                        ? "#25272A"
                                        : "#FEE2E2"
                                    : isDark
                                      ? "#1A1A1A"
                                      : "#FFFFFF",
                                border: isRefreshHovered
                                    ? isDark
                                        ? "1px solid #333336"
                                        : "1px solid #FCA5A5"
                                    : isDark
                                      ? "1px solid #2A2A2A"
                                      : "1px solid #E5E7EB",
                                color: isRefreshHovered
                                    ? isDark
                                        ? "#E5E7EB"
                                        : "#DC2626"
                                    : isDark
                                      ? "#E5E7EB"
                                      : "#374151",
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
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                            Refresh
                        </button>
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
                <div className="px-6 pb-6 flex-1 flex flex-col">
                    <div className="mb-6">
                        <p
                            className="text-sm transition-colors duration-300"
                            style={{
                                color: isDark 
                                    ? "#9CA3AF" 
                                    : "#6B7280",
                            }}
                        >
                            Kelola antrean pasien saat ini dengan lebih mudah dan cepat.
                        </p>
                    </div>
                    <div
                        className="rounded-2xl flex-1 flex flex-col items-center justify-center p-32 overflow-hidden transition-all duration-300"
                    >
                        <div className="flex flex-col w-fit h-fit items-center justify-center gap-6">
                            {queueData.length > 0 ? (
                                <>
                                    <div 
                                        className="min-w-160 min-h-90 h-fit w-fit overflow-hidden relative rounded-2xl bg-red-500 p-8 flex items-center justify-center flex-col"
                                        style={{
                                            backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                                            border: isDark
                                                ? "1px solid #2A2A2A"
                                                : "1px solid #E5E7EB",
                                            color: isDark
                                                ? "#E5E7EB"
                                                : "#374151",
                                        }}
                                    >
                                        {(() => {
                                            const currentItem = queueData[queueIndex];

                                            if (!currentItem) return;
                                            
                                            return (
                                                <>
                                                    <span 
                                                        className="w-12 h-12 text-xl font-medium rounded-br-xl absolute top-0 left-0 flex items-center justify-center overflow-hidden"
                                                        style={{
                                                            backgroundColor: isDark
                                                                ? "#E5E7EB"
                                                                : "#DC2626",
                                                            color: isDark
                                                                ? "#1A1A1A"
                                                                : "#FFFFFF"
                                                        }}    
                                                    >
                                                        {queueIndex + 1}
                                                    </span>
                                                    <div className="flex flex-col items-center justify-center w-full flex-1 gap-4">
                                                        <span className="flex flex-col items-center justify-center w-fit h-fit">
                                                            <h1 className="text-4xl font-semibold text-center text-nowrap truncate w-full">
                                                                {currentItem.patientName}
                                                            </h1>
                                                            <h2 className="text-md opacity-80 text-center">
                                                                {currentItem.queueNumber} | {`Cluster ${currentItem.cluster.toString().slice(7)}`}
                                                            </h2>
                                                        </span>
                                                        <span className="flex items-center justify-center w-fit h-fit gap-4">
                                                            <span 
                                                                className="size-4 rounded-full"
                                                                style={{
                                                                    backgroundColor: getStatusColor(currentItem.status)
                                                                }}
                                                            >

                                                            </span>
                                                            <h2 className="text-sm opacity-80">
                                                                {currentItem?.status}
                                                            </h2>
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-fit flex items-center justify-center gap-4">
                                                        <button
                                                            onClick={() =>
                                                                handlePanggil(
                                                                    currentItem.id,
                                                                )
                                                            }
                                                            className="px-3 py-2 max-w-[120px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
                                                            style={{
                                                                backgroundColor:
                                                                    isDark
                                                                        ? "#065F46"
                                                                        : "#D1FAE5",
                                                                color: isDark
                                                                    ? "#6EE7B7"
                                                                    : "#065F46",
                                                                border: isDark
                                                                    ? "1px solid #047857"
                                                                    : "1px solid #10B981",
                                                            }}
                                                        >
                                                            Panggil
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleLewati(
                                                                    currentItem.id,
                                                                );
                                                                if (queueIndex < maxIndex) setQueueIndex((current) => current + 1);
                                                            }
                                                            }
                                                            className="px-3 py-2 max-w-[120px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
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
                                                                    : "1px solid #DC2626",
                                                            }}
                                                        >
                                                            Lewati
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handlePeriksa(
                                                                    currentItem.id,
                                                                )
                                                            }
                                                            className="px-3 py-2 max-w-[120px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
                                                            style={{
                                                                backgroundColor: isDark
                                                                    ? "#78350F"
                                                                    : "#FEF3C7",
                                                                color: isDark
                                                                    ? "#FCD34D"
                                                                    : "#92400E",
                                                                border: isDark
                                                                    ? "1px solid #D97706"
                                                                    : "1px solid #F59E0B",
                                                            }}
                                                        >
                                                            Periksa
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleSelesai(
                                                                    currentItem.id,
                                                                )
                                                            }
                                                            className="px-3 py-2 max-w-[120px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
                                                            style={{
                                                                backgroundColor:
                                                                    isDark
                                                                        ? "#1E40AF"
                                                                        : "#DBEAFE",
                                                                color: isDark
                                                                    ? "#93C5FD"
                                                                    : "#1E40AF",
                                                                border: isDark
                                                                    ? "1px solid #1E3A8A"
                                                                    : "1px solid #93C5FD",
                                                            }}
                                                        >
                                                            Selesai
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        })()}
                                    </div>
                                    <div
                                        className="flex items-center justify-center w-fit h-fit gap-4"
                                        style={{
                                            color: isDark
                                                ? "#E5E7EB"
                                                : "#374151"
                                        }}
                                    >
                                        <button 
                                            onMouseEnter={() => {
                                                if (queueIndex > 0) setIsPreviousHovered(true);
                                            }}
                                            onMouseLeave={() => {
                                                if (queueIndex > 0 || isPreviousHovered) setIsPreviousHovered(false);
                                            }}
                                            onClick={() => {
                                                if (queueIndex > 0) setQueueIndex((current) => current - 1);
                                            }}
                                            className="size-8 transition-all duration-300 rounded-full text-lg p-2 flex items-center justify-center"
                                            style={{
                                                opacity: `${queueIndex > 0 ? "100%" : "50%"}`,
                                                pointerEvents: `${queueIndex > 0 ? "auto" : "none"}`,
                                                backgroundColor: isPreviousHovered
                                                    ? isDark
                                                        ? "#25272A"
                                                        : "#FEE2E2"
                                                    : isDark
                                                    ? "#1A1A1A"
                                                    : "#FFFFFF",
                                                border: isPreviousHovered
                                                    ? isDark
                                                        ? "1px solid #333336"
                                                        : "1px solid #FCA5A5"
                                                    : isDark
                                                    ? "1px solid #2A2A2A"
                                                    : "1px solid #E5E7EB",
                                                color: isPreviousHovered
                                                    ? isDark
                                                        ? "#E5E7EB"
                                                        : "#DC2626"
                                                    : isDark
                                                    ? "#E5E7EB"
                                                    : "#374151",
                                            }}  
                                        >
                                            <svg 
                                                className="w-full h-full" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path 
                                                    d="M15 20L7 12L15 4" 
                                                    stroke="currentColor" 
                                                    strokeWidth="3" 
                                                    strokeLinecap="round" strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <p className="text-md opacity-80">
                                            {queueIndex + 1} dari {maxIndex + 1}
                                        </p>
                                        <button 
                                            onMouseEnter={() => {
                                                if (queueIndex < maxIndex) setIsNextHovered(true);
                                            }}
                                            onMouseLeave={() => {
                                                if (queueIndex < maxIndex || isNextHovered) setIsNextHovered(false);
                                            }}
                                            onClick={() => {
                                                if (queueIndex < maxIndex) setQueueIndex((current) => current + 1);
                                            }}
                                            className="size-8 transition-all duration-300 rounded-full text-lg p-2 flex items-center justify-center"
                                            style={{
                                                opacity: `${queueIndex < maxIndex ? "100%" : "50%"}`,
                                                pointerEvents: `${queueIndex < maxIndex ? "auto" : "none"}`,
                                                backgroundColor: isNextHovered
                                                    ? isDark
                                                        ? "#25272A"
                                                        : "#FEE2E2"
                                                    : isDark
                                                    ? "#1A1A1A"
                                                    : "#FFFFFF",
                                                border: isNextHovered
                                                    ? isDark
                                                        ? "1px solid #333336"
                                                        : "1px solid #FCA5A5"
                                                    : isDark
                                                    ? "1px solid #2A2A2A"
                                                    : "1px solid #E5E7EB",
                                                color: isNextHovered
                                                    ? isDark
                                                        ? "#E5E7EB"
                                                        : "#DC2626"
                                                    : isDark
                                                    ? "#E5E7EB"
                                                    : "#374151",
                                            }} 
                                        >
                                            <svg 
                                                className="w-full h-full rotate-z-180" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path 
                                                    d="M15 20L7 12L15 4" 
                                                    stroke="currentColor" 
                                                    strokeWidth="3" 
                                                    strokeLinecap="round" strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ): (
                                <div 
                                    className="max-w-120 max-h-20 h-fit w-fit py-5 px-8 rounded-lg"
                                    style={{
                                        backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB"
                                    }}
                                >
                                    <h4
                                        className="text-sm"
                                        style={{
                                            color: isDark ? "#9CA3AF" : "#6B7280",
                                        }}
                                    >
                                        Tidak ada data antrean saat ini
                                    </h4>
                                </div>
                            )}
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
}