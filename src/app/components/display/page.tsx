"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface QueueItem {
  id: number;
  queueNumber: string;
  patientName: string;
  status: "Dipanggil" | "Menunggu" | "Sedang Diperiksa" | "Selesai";
  cluster: number;
}

interface ClusterQueue {
  cluster: number;
  currentQueue: string;
  prefix: string;
}

export default function Display() {
  const [isDark, setIsDark] = useState(false);
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [clusterQueues, setClusterQueues] = useState<ClusterQueue[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/layar");
  };

  // Sample data untuk cluster 1 (yang dipanggil)
  const [queueData] = useState<QueueItem[]>([
    {
      id: 1,
      queueNumber: "25",
      patientName: "Budi Santoso",
      status: "Dipanggil",
      cluster: 2,
    },
  ]);

  useEffect(() => {
    // Set current queue untuk cluster 1
    const current = queueData.find((item) => item.status === "Dipanggil");
    setCurrentQueue(current || queueData[0]);

    // Generate random queue numbers untuk setiap cluster
    const clusters: ClusterQueue[] = [
      { cluster: 1, currentQueue: "A25", prefix: "A" },
      { cluster: 2, currentQueue: `B${Math.floor(Math.random() * 20) + 10}`, prefix: "B" },
      { cluster: 3, currentQueue: `C${Math.floor(Math.random() * 20) + 10}`, prefix: "C" },
      { cluster: 4, currentQueue: `D${Math.floor(Math.random() * 20) + 10}`, prefix: "D" },
    ];
    
    setClusterQueues(clusters);

    // Update time and date
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [queueData]);

  return (
    <div
      className="w-screen h-screen transition-colors duration-300 overflow-hidden flex flex-col"
      style={{
        backgroundColor: isDark ? "#0D0D0D" : "#F5F5F5",
      }}
    >
      {/* Header */}
      <div
        className="px-8 py-4 flex items-center justify-between border-b transition-colors duration-300"
        style={{
          borderColor: isDark ? "#1F1F1F" : "#E5E7EB",
          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
        }}
      >
        {/* Logo Puskesmas - Kiri */}
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
          <Image src="/icon/a.png" alt="Logo Puskesmas" width={64} height={64} />
        </div>

        {/* Title - Tengah */}
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

        {/* Logo Aceh Besar - Kanan */}
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
          <Image src="/icon/b.png" alt="Logo Aceh Besar" width={64} height={64} />
        </div>
      </div>

      {/* Main Content */}
      

      {/* Footer */}
      <div
        className="px-8 py-3 flex items-center justify-between border-t transition-colors duration-300 relative overflow-hidden"
        style={{
          borderColor: isDark ? "#1F1F1F" : "#E5E7EB",
          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
        }}
      >
        {/* Jam - Kiri */}
        <div
          className="text-3xl font-bold flex-shrink-0 z-10"
          style={{
            color: isDark ? "#FFFFFF" : "#111827",
          }}
        >
          {currentTime}
        </div>

        {/* Running Text - Tengah */}
        <div className="flex-1 overflow-hidden mx-8">
          <div className="animate-marquee whitespace-nowrap">
            <p
              className="text-lg font-semibold inline-block transition-colors duration-300"
              style={{
                color: isDark ? "#9CA3AF" : "#6B7280",
                animation: "marquee 25s linear infinite",
              }}
            >
              Seluruh pelayanan di Puskesmas Masjid Raya ditangani oleh Dokter,
              Perawat, dan Staf yang profesional serta ramah dalam melayani
              pasien.
            </p>
          </div>
        </div>

        {/* Back Button - Kanan */}
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 flex-shrink-0"
          style={{
            backgroundColor: isDark ? "#DC2626" : "#DC2626",
            color: "#FFFFFF",
            border: isDark ? "1px solid #991B1B" : "1px solid #B91C1C",
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
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Kembali</span>
        </button>

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