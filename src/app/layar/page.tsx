"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueueStatus } from "../props/UserData";
import Image from "next/image";

interface QueueItem {
    id: number;
    queueNumber: string;
    patientName: string;
    status: QueueStatus;
    cluster: number;
}

interface ClusterQueue {
    cluster: number;
    queue: string;
    prefix: string;
}

export default function Display() {
    const [isDark, setIsDark] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<string>("");
    const router = useRouter();

    const handleBack = () => {
        router.push("/admin/layar");
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            setCurrentTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            );
            setCurrentDate(
                now.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            );
        };
        updateTime();

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="w-screen h-screen transition-colors duration-300 overflow-hidden flex flex-col"
            style={{
                backgroundColor: isDark ? "#0D0D0D" : "#F5F5F5",
            }}
        >
            <div
                className="px-8 py-4 flex items-center justify-between border-b transition-colors duration-300"
                style={{
                    borderColor: isDark ? "#1F1F1F" : "#E5E7EB",
                    backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                }}
            >
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Image
                        src="/icon/a.png"
                        alt="Logo Puskesmas"
                        width={60}
                        height={60}
                    />
                </div>
                <div className="flex-1 text-center px-4">
                    <h1
                        className="text-2xl font-bold transition-colors duration-300"
                        style={{
                            color: isDark ? "#FFFFFF" : "#111827",
                        }}
                    >
                        Puskesmas Mesjid Raya
                    </h1>
                    <p
                        className="text-sm transition-colors duration-300"
                        style={{
                            color: isDark ? "#9CA3AF" : "#6B7280",
                        }}
                    >
                        Gp. Beurandeh, Kec. Mesjid Raya, Kab. Aceh Besar, Aceh
                    </p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Image
                        src="/icon/b.png"
                        alt="Logo Aceh Besar"
                        width={64}
                        height={64}
                    />
                </div>
            </div>
            <div>
                {/* TODO: Isi main container */}
            </div>
            <div
                className="px-8 py-3 flex items-center justify-between border-t transition-colors duration-300 relative overflow-hidden"
                style={{
                    borderColor: isDark ? "#1F1F1F" : "#E5E7EB",
                    backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                }}
            >
                <div
                    className="text-xl flex items-center justify-center gap-3 flex-shrink-0 z-10"
                    style={{
                        color: isDark ? "#FFFFFF" : "#111827",
                    }}
                >
                    <h2 className="font-medium">
                        {currentDate}
                    </h2>
                    <span 
                        className="h-6 w-[2px]"
                        style={{
                            backgroundColor: isDark ? "#9CA3AF" : "#6B7280"
                        }}
                    ></span>
                    <h2 className="font-semibold">
                        {currentTime}
                    </h2>
                </div>
                <div className="flex-1 overflow-hidden mx-8">
                    <div className="animate-marquee whitespace-nowrap">
                        <p
                            className="text-lg font-medium inline-block transition-colors duration-300"
                            style={{
                                color: isDark ? "#9CA3AF" : "#6B7280",
                                animation: "marquee 25s linear infinite",
                            }}
                        >
                            Seluruh pelayanan di Puskesmas Masjid Raya ditangani
                            oleh Dokter, Perawat, dan Staf yang profesional
                            serta ramah dalam melayani pasien.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center w-fit h-fit gap-2">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="size-10 flex items-center justify-center rounded-lg transition-all duration-300"
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
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 max-h-10 text-md rounded-lg transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                        style={{
                            backgroundColor: isDark ? "#DC2626" : "#DC2626",
                            color: "#FFFFFF",
                            border: isDark
                                ? "1px solid #991B1B"
                                : "1px solid #B91C1C",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark
                                ? "#991B1B"
                                : "#B91C1C";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#DC2626";
                        }}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        <span className="font-medium">
                            Kembali
                        </span>
                    </button>
                </div>
                <style jsx>{`
                    @keyframes marquee {
                        0% {
                            transform: translateX(100%);
                        }
                        100% {
                            transform: translateX(-100%);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
