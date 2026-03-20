"use client";

import { useState, useCallback } from "react";
import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { UserData, QueueStatus } from "../props/UserData";
import { useRouter } from "next/navigation";

interface QueueItem {
    id: number;
    queueNumber: string;
    patientName: string;
    status: QueueStatus;
    cluster: number;
}

export default function DaftarAntreanPage() {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshHovered, setIsRefreshHovered] = useState(false);
    const [isExportHovered, setIsExportHovered] = useState(false);
    const itemsPerPage = 15;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [queueData, setQueueData] = useState<QueueItem[]>([]);

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

    const totalPages = Math.ceil(queueData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = queueData.slice(startIndex, endIndex);

    const handleRefresh = useCallback(() => {
        fetchData(userData);
        showToast("Data berhasil direfresh");
    }, [userData]);

    const handleExportCSV = useCallback(() => {
        if (!queueData.length) {
            showToast("Tidak ada data antrean untuk diekspor");
            return;
        }

        const headers = [
            "No",
            "Nomor Antrean",
            "Nama Pasien",
            "Status",
            "Cluster",
        ];
        const rows = queueData.map((item, index) => [
            index + 1,
            item.queueNumber,
            item.patientName,
            item.status,
            item.cluster,
        ]);

        const csvContent = [headers, ...rows]
            .map((row) =>
                row
                    .map((field) => {
                        if (typeof field === "string" && field.includes(",")) {
                            return `"${field.replace(/"/g, '""')}"`;
                        }
                        return field;
                    })
                    .join(","),
            )
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `antrean_${new Date().toISOString()}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("Data antrean berhasil diekspor", "success");
    }, [queueData]);

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
                    return isDark ? "#1E40AF" : "#DBEAFE";
                case "Menunggu":
                    return isDark ? "#78350F" : "#FEF3C7";
                case "Sedang Diperiksa":
                    return isDark ? "#065F46" : "#D1FAE5";
                case "Selesai":
                    return isDark ? "#1F2937" : "#F3F4F6";
                default:
                    return isDark ? "#1F2937" : "#F3F4F6";
            }
        },
        [isDark],
    );

    const getStatusTextColor = useCallback(
        (status: string) => {
            switch (status) {
                case "Dipanggil":
                    return isDark ? "#93C5FD" : "#1E40AF";
                case "Menunggu":
                    return isDark ? "#FCD34D" : "#92400E";
                case "Sedang Diperiksa":
                    return isDark ? "#6EE7B7" : "#065F46";
                case "Selesai":
                    return isDark ? "#9CA3AF" : "#6B7280";
                default:
                    return isDark ? "#9CA3AF" : "#6B7280";
            }
        },
        [isDark],
    );

    return (
        <div className="flex h-screen">
            <div
                className="flex-1 overflow-y-auto transition-colors duration-300"
                style={{
                    backgroundColor: isDark ? "#0D0D0D" : "#F9FAFB",
                }}
            >
                <div 
                    className="w-full h-fit px-8 py-4 flex items-center justify-between gap-8"
                    style={{
                        backgroundColor: isDark ? "#0D0D0D" : "#F9FAFB",
                        borderBottom: isDark
                            ? "1px solid #2A2A2A"
                            : "1px solid #E5E7EB",
                    }}
                >
                    <button
                        onClick={handleLogout}
                        className="w-fit flex items-center gap-3 px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                        style={{
                            color: isDark ? "#FCA5A5" : "#DC2626",
                            backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                            border: isDark
                                ? "1px solid #991B1B"
                                : "1px solid #DC2626"
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
                        Logout
                    </button>
                    <div className="w-fit h-fit flex items-center justify-center gap-4">
                        <div className="w-fit h-fit flex flex-col items-end justify-center">
                            <h1 
                                className="text-md"
                                style={{
                                    color: isDark ? "#FFFFFF" : "#111827",
                                }}
                            >
                                {userData?.name}
                            </h1>
                            <h3 
                                className="text-xs"
                                style={{
                                    color: isDark ? "#9CA3AF" : "#6B7280",
                                }}
                            >
                                {userData?.nip}
                            </h3>
                        </div>
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 flex-shrink-0"
                            style={{
                                backgroundColor: isDark ? "#1F1F1F" : "#E5E7EB",
                                color: isDark ? "#E5E7EB" : "#374151",
                            }}
                        >
                            {userData?.name.at(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-6 pb-3">
                    <div>
                        <h1
                            className="text-3xl font-bold transition-colors duration-300"
                            style={{
                                color: isDark ? "#FFFFFF" : "#111827",
                            }}
                        >
                            Daftar Antrean
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
                            onClick={handleExportCSV}
                            onMouseEnter={() => setIsExportHovered(true)}
                            onMouseLeave={() => setIsExportHovered(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                            style={{
                                backgroundColor: isExportHovered
                                    ? isDark
                                        ? "#25272A"
                                        : "#FEE2E2"
                                    : isDark
                                      ? "#1A1A1A"
                                      : "#FFFFFF",
                                border: isExportHovered
                                    ? isDark
                                        ? "1px solid #333336"
                                        : "1px solid #FCA5A5"
                                    : isDark
                                      ? "1px solid #2A2A2A"
                                      : "1px solid #E5E7EB",
                                color: isExportHovered
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
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Ekspor CSV
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
                <div className="px-6 pb-6">
                    <div className="mb-6">
                        <p
                            className="text-sm transition-colors duration-300"
                            style={{
                                color: isDark ? "#9CA3AF" : "#6B7280",
                            }}
                        >
                            Kelola antrean pasien yang sedang berjalan, termasuk
                            memanggil atau melewati antrean.
                        </p>
                    </div>
                    <div
                        className="rounded-2xl overflow-hidden transition-all duration-300"
                        style={{
                            backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                            border: isDark
                                ? "1px solid #2A2A2A"
                                : "1px solid #E5E7EB",
                        }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed">
                                <thead
                                    style={{
                                        backgroundColor: isDark
                                            ? "#0D0D0D"
                                            : "#F9FAFB",
                                    }}
                                >
                                    <tr
                                        style={{
                                            borderBottom: isDark
                                                ? "1px solid #2A2A2A"
                                                : "1px solid #E5E7EB",
                                        }}
                                    >
                                        <th
                                            className="text-center px-6 py-4 text-sm font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#9CA3AF"
                                                    : "#6B7280",
                                            }}
                                        >
                                            No
                                        </th>
                                        <th
                                            className="text-center px-6 py-4 text-sm font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#9CA3AF"
                                                    : "#6B7280",
                                            }}
                                        >
                                            Nomor Antrean
                                        </th>
                                        <th
                                            className="text-center px-6 py-4 text-sm font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#9CA3AF"
                                                    : "#6B7280",
                                            }}
                                        >
                                            Nama Pasien
                                        </th>
                                        <th
                                            className="text-center px-6 py-4 text-sm font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#9CA3AF"
                                                    : "#6B7280",
                                            }}
                                        >
                                            Status
                                        </th>
                                        <th
                                            className="text-center px-6 py-4 whitespace-nowrap text-sm font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#9CA3AF"
                                                    : "#6B7280",
                                            }}
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom:
                                                    index <
                                                    currentData.length - 1
                                                        ? isDark
                                                            ? "1px solid #2A2A2A"
                                                            : "1px solid #E5E7EB"
                                                        : "none",
                                            }}
                                        >
                                            <td
                                                className="px-6 py-4 text-sm text-center align-middle transition-colors duration-300"
                                                style={{
                                                    color: isDark
                                                        ? "#E5E7EB"
                                                        : "#374151",
                                                }}
                                            >
                                                {startIndex + index + 1}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-sm text-center align-middle transition-colors duration-300"
                                                style={{
                                                    color: isDark
                                                        ? "#E5E7EB"
                                                        : "#374151",
                                                }}
                                            >
                                                {item.queueNumber}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-sm text-center align-middle transition-colors duration-300"
                                                style={{
                                                    color: isDark
                                                        ? "#E5E7EB"
                                                        : "#374151",
                                                }}
                                            >
                                                {item.patientName}
                                            </td>
                                            <td className="px-2 py-4 text-center align-middle">
                                                <span
                                                    className="px-3 py-2 rounded-lg text-sm font-medium inline-block transition-colors duration-300"
                                                    style={{
                                                        backgroundColor:
                                                            getStatusColor(
                                                                item.status,
                                                            ),
                                                        color: getStatusTextColor(
                                                            item.status,
                                                        ),
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center justify-center gap-1 flex-wrap max-w-100">
                                                    <button
                                                        onClick={() =>
                                                            handlePanggil(
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
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
                                                        onClick={() =>
                                                            handleLewati(
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-"
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
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-"
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
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-"
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="flex items-center justify-between px-6 py-4 transition-colors duration-300"
                            style={{
                                borderTop: isDark
                                    ? "1px solid #2A2A2A"
                                    : "1px solid #E5E7EB",
                            }}
                        >
                            <p
                                className="text-sm transition-colors duration-300"
                                style={{
                                    color: isDark ? "#9CA3AF" : "#6B7280",
                                }}
                            >
                                Menampilkan {startIndex + 1}{"-"}
                                {Math.min(endIndex, queueData.length)}{" dari "}
                                {queueData.length} Pasien
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg transition-all duration-150"
                                    style={{
                                        backgroundColor:
                                            currentPage === 1
                                                ? "transparent"
                                                : isDark
                                                  ? "#1A1A1A"
                                                  : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
                                        color: isDark ? "#9CA3AF" : "#6B7280",
                                        cursor:
                                            currentPage === 1
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <polyline points="11 17 6 12 11 7" />
                                        <polyline points="18 17 13 12 18 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg transition-all duration-150"
                                    style={{
                                        backgroundColor:
                                            currentPage === 1
                                                ? "transparent"
                                                : isDark
                                                  ? "#1A1A1A"
                                                  : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
                                        color: isDark ? "#9CA3AF" : "#6B7280",
                                        cursor:
                                            currentPage === 1
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                {[...Array(Math.min(3, totalPages))].map(
                                    (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 2) {
                                            pageNum = i + 1;
                                        } else if (
                                            currentPage >=
                                            totalPages - 1
                                        ) {
                                            pageNum = totalPages - 2 + i;
                                        } else {
                                            pageNum = currentPage - 1 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className="w-9 h-9 rounded-lg transition-all duration-150 text-sm font-medium"
                                                style={{
                                                    backgroundColor:
                                                        currentPage === pageNum
                                                            ? isDark
                                                                ? "#313337"
                                                                : "#DC2626"
                                                            : isDark
                                                              ? "#1A1A1A"
                                                              : "#FFFFFF",
                                                    border:
                                                        currentPage === pageNum
                                                            ? isDark
                                                                ? "1px solid #404145"
                                                                : "1px solid #DC2626"
                                                            : isDark
                                                              ? "1px solid #2A2A2A"
                                                              : "1px solid #E5E7EB",
                                                    color:
                                                        currentPage === pageNum
                                                            ? "#FFFFFF"
                                                            : isDark
                                                              ? "#9CA3AF"
                                                              : "#6B7280",
                                                }}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    },
                                )}
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg transition-all duration-150"
                                    style={{
                                        backgroundColor:
                                            currentPage === totalPages
                                                ? "transparent"
                                                : isDark
                                                  ? "#1A1A1A"
                                                  : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
                                        color: isDark ? "#9CA3AF" : "#6B7280",
                                        cursor:
                                            currentPage === totalPages
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity:
                                            currentPage === totalPages
                                                ? 0.5
                                                : 1,
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg transition-all duration-150"
                                    style={{
                                        backgroundColor:
                                            currentPage === totalPages
                                                ? "transparent"
                                                : isDark
                                                  ? "#1A1A1A"
                                                  : "#FFFFFF",
                                        border: isDark
                                            ? "1px solid #2A2A2A"
                                            : "1px solid #E5E7EB",
                                        color: isDark ? "#9CA3AF" : "#6B7280",
                                        cursor:
                                            currentPage === totalPages
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity:
                                            currentPage === totalPages
                                                ? 0.5
                                                : 1,
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <polyline points="13 17 18 12 13 7" />
                                        <polyline points="6 17 11 12 6 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
