"use client";

import Sidebar from "@/app/components/Sidebar";
import { useState, useCallback } from "react";

interface QueueItem {
    id: number;
    queueNumber: string;
    patientName: string;
    status: "Dipanggil" | "Menunggu" | "Sedang Diperiksa" | "Selesai";
    cluster: number;
}

export default function DaftarAntreanPage() {
    const [isDark, setIsDark] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshHovered, setIsRefreshHovered] = useState(false);
    const [isExportHovered, setIsExportHovered] = useState(false);
    const itemsPerPage = 15;

    // FIXME: Data sementara, ganti dengan data asli jika sudah ada API
    const [queueData] = useState<QueueItem[]>([
        {
            id: 1,
            queueNumber: "A8",
            patientName: "Budi Santoso",
            status: "Dipanggil",
            cluster: 1,
        },
        {
            id: 2,
            queueNumber: "A9",
            patientName: "Mahardika",
            status: "Menunggu",
            cluster: 1,
        },
        {
            id: 3,
            queueNumber: "A10",
            patientName: "Siti Nurhaliza",
            status: "Sedang Diperiksa",
            cluster: 2,
        },
        {
            id: 4,
            queueNumber: "A11",
            patientName: "Ahmad Wijaya",
            status: "Selesai",
            cluster: 3,
        },
    ]);

    // FIXME: Data sementara, ganti dengan data asli jika sudah ada API
    const clusterCounts = [1, 2, 3, 4].map(
        (cluster) =>
            queueData.filter(
                (item) => item.cluster === cluster && item.status !== "Selesai",
            ).length,
    );

    // FIXME: Data sementara, ganti dengan data asli jika sudah ada API
    const clusterDoctors = [
        "dr. Budi Santoso",
        "dr. Badi Sambas",
        "dr. Putri",
        "Dr. Teuku",
    ];

    const totalPages = Math.ceil(queueData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = queueData.slice(startIndex, endIndex);

    const handleRefresh = useCallback(() => {
        // TODO: Tambahkan logika untuk fetching ulang data
    }, []);

    const handleExportCSV = useCallback(() => {
        // TODO: Tambahkan logika untuk simpan data JSON ke CSV
    }, []);

    const handlePanggil = useCallback((id: number) => {
        // TODO: Tambahkan logika untuk memanggil nama pasien
    }, []);

    const handleLewati = useCallback((id: number) => {
        // TODO: Tambahkan logika untuk melewati pasien
    }, []);

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
            <Sidebar isDark={isDark} />
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
                            Kelola antrean pasien yang sedang berjalan,
                            termasuk memanggil atau melewati antrean.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[1, 2, 3, 4].map((cluster) => (
                            <div
                                key={cluster}
                                className="rounded-xl p-5 transition-all duration-300"
                                style={{
                                    backgroundColor: isDark
                                        ? "#1A1A1A"
                                        : "#FFFFFF",
                                    border: isDark
                                        ? "1px solid #2A2A2A"
                                        : "1px solid #E5E7EB",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p
                                            className="text-xs uppercase tracking-wider mb-1 transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#6B7280"
                                                    : "#9CA3AF",
                                            }}
                                        >
                                            Cluster {cluster}
                                        </p>
                                        <h3
                                            className="text-base font-semibold transition-colors duration-300"
                                            style={{
                                                color: isDark
                                                    ? "#FFFFFF"
                                                    : "#111827",
                                            }}
                                        >
                                            {clusterDoctors[cluster - 1]}
                                        </h3>
                                    </div>
                                    <div
                                        className="w-14 h-14 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors duration-300"
                                        style={{
                                            backgroundColor: isDark
                                                ? "#0D0D0D"
                                                : "#F9FAFB",
                                            border: isDark
                                                ? "1px solid #2A2A2A"
                                                : "1px solid #E5E7EB",
                                            color: isDark
                                                ? "#E5E7EB"
                                                : "#374151",
                                        }}
                                    >
                                        {clusterCounts[cluster - 1]}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            <table className="w-full">
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
                                            className="text-center px-6 py-4 text-sm font-semibold transition-colors duration-300"
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
                                                <div className="flex items-center justify-center gap-1 flex-wrap">
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
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
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
                                                            console.log(
                                                                "Selesai:",
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg text-xs font-medium transition-all duration-150 flex-1 min-w-max"
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
                                Showing {startIndex + 1} to{" "}
                                {Math.min(endIndex, queueData.length)} of{" "}
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
                                        } 
                                        else if (currentPage <= 2) {
                                            pageNum = i + 1;
                                        } 
                                        else if (
                                            currentPage >=
                                            totalPages - 1
                                        ) {
                                            pageNum = totalPages - 2 + i;
                                        } 
                                        else {
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
