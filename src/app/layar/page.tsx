"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface QueueItem {
  id: string;
  queueNumber: string;
  patientName: string;
  status: string;
  cluster: string;
  createdAt: string;
}

interface DisplayQueue {
  cluster: number;
  queue: string;
  label: string;
}

interface ThemeColors {
  bg: string;
  section: string;
  border: string;
  headerBg: string;
  headerText: string;
  subText: string;
  cardBg: string;
  cardSoft: string;
  primary: string;
  primaryDark: string;
  text: string;
  textSoft: string;
  buttonBg: string;
  buttonBorder: string;
}

const getTheme = (isDark: boolean): ThemeColors => {
  return {
    bg: isDark ? "#121212" : "#F5F5F5",
    section: isDark ? "#1B1B1B" : "#FFFFFF",
    border: isDark ? "#404145" : "#F2CACA",
    headerBg: isDark ? "#1B1B1B" : "#FFFFFF",
    headerText: isDark ? "#FFFFFF" : "#111827",
    subText: isDark ? "#D1D5DB" : "#374151",
    cardBg: isDark ? "#202020" : "#FFFFFF",
    cardSoft: isDark ? "#2A2A2A" : "#FDF3F3",
    primary: isDark ? "#313337" : "#D62828",
    primaryDark: isDark ? "#313337" : "#B91C1C",
    text: isDark ? "#FFFFFF" : "#111827",
    textSoft: isDark ? "#D1D5DB" : "#6B7280",
    buttonBg: isDark ? "#313337" : "#FFFFFF",
    buttonBorder: isDark ? "#404145" : "#E5E7EB",
  };
};

function QueueBigCard({
  title,
  value,
  footer,
  theme,
}: {
  title: string;
  value: string;
  footer: string;
  theme: ThemeColors;
}) {
  return (
    <div
      className="h-full rounded-[20px] overflow-hidden flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div
        className="h-[22%] flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.primary }}
      >
        <h2 className="text-white text-4xl font-bold">{title}</h2>
      </div>

      <div
        className="flex-1 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.cardSoft }}
      >
        <h1 className="text-[9rem] leading-none font-light" style={{ color: theme.text }}>
          {value || "-"}
        </h1>
      </div>

      <div
        className="h-[18%] flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.primaryDark }}
      >
        <h3 className="text-white text-3xl font-bold">{footer}</h3>
      </div>
    </div>
  );
}

function QueueSmallCard({
  title,
  value,
  footer,
  theme,
}: {
  title: string;
  value: string;
  footer: string;
  theme: ThemeColors;
}) {
  return (
    <div
      className="h-full rounded-[20px] overflow-hidden flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div
        className="h-[25%] flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.primary }}
      >
        <h2 className="text-white text-2xl font-bold">{title}</h2>
      </div>

      <div
        className="flex-1 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.cardSoft }}
      >
        <h1 className="text-[6.5rem] leading-none font-light" style={{ color: theme.text }}>
          {value || "-"}
        </h1>
      </div>

      <div
        className="h-[20%] flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: theme.primaryDark }}
      >
        <h3 className="text-white text-2xl font-bold">{footer}</h3>
      </div>
    </div>
  );
}

export default function DisplayPage() {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const router = useRouter();

  const theme = getTheme(isDark);

  useEffect(() => {
    const savedTheme = localStorage.getItem("display-theme");
    if (savedTheme === "dark") {
      queueMicrotask(() => setIsDark(true));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("display-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/antrean", {
          cache: "no-store",
        });
        const data = await res.json();
        setQueueItems(Array.isArray(data.queue) ? data.queue : []);
      } catch {
        setQueueItems([]);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentCalled = useMemo(() => {
    return queueItems.find((item) => item.status === "DIPANGGIL") || queueItems[0];
  }, [queueItems]);

  const clusterQueues: DisplayQueue[] = useMemo(() => {
    const clusterLabels = [
      { cluster: 1, label: "Cluster 1" },
      { cluster: 2, label: "Cluster 2" },
      { cluster: 3, label: "Cluster 3" },
      { cluster: 4, label: "Cluster 4" },
    ];

    return clusterLabels.map((clusterInfo) => {
      const latestQueue = queueItems
        .filter((item) => item.cluster === `cluster${clusterInfo.cluster}`)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

      return {
        cluster: clusterInfo.cluster,
        queue: latestQueue?.queueNumber || "-",
        label: clusterInfo.label,
      };
    });
  }, [queueItems]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      <header
        className="px-8 py-3 flex items-center justify-between border-b transition-colors duration-300"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.headerBg,
        }}
      >
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <Image src="/icon/a.png" alt="Logo Puskesmas" width={56} height={56} />
        </div>

        <div className="flex-1 text-center px-4">
          <h1
            className="text-3xl font-bold transition-colors duration-300"
            style={{ color: theme.headerText }}
          >
            Puskesmas Mesjid Raya
          </h1>
          <p
            className="text-xl font-semibold transition-colors duration-300"
            style={{ color: theme.subText }}
          >
            Gp. Beurandeh, Kec. Mesjid Raya, Kab. Aceh Besar, Aceh
          </p>
        </div>

        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <Image src="/icon/b.png" alt="Logo Aceh Besar" width={56} height={56} />
        </div>
      </header>

      <main className="flex-1 px-8 py-4 overflow-hidden">
        <section
          className="w-full h-full rounded-[24px] p-4 flex flex-col transition-colors duration-300"
          style={{
            backgroundColor: theme.section,
          }}
        >
          <div className="grid grid-cols-12 gap-5 h-[55%]">
            <div className="col-span-7 h-full">
              <div
                className="w-full h-full rounded-[20px] overflow-hidden relative transition-colors duration-300"
                style={{
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.cardBg,
                }}
              >
                <Image
                  src="/banner/banner.jpg"
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="col-span-5 h-full">
              <QueueBigCard
                title="No. Antrean"
                value={currentCalled?.queueNumber || "-"}
                footer={`Cluster ${currentCalled ? currentCalled.cluster.replace("cluster", "") : "-"}`}
                theme={theme}
              />
            </div>
          </div>

          <div className="h-[3%]" />

          <div className="grid grid-cols-4 gap-5 h-[42%]">
            {clusterQueues.map((item) => (
              <QueueSmallCard
                key={item.cluster}
                title="No. Antrean"
                value={item.queue}
                footer={item.label}
                theme={theme}
              />
            ))}
          </div>
        </section>
      </main>

      <footer
        className="px-8 py-3 flex items-center justify-between border-t overflow-hidden transition-colors duration-300"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.headerBg,
        }}
      >
        <div
          className="text-xl flex items-center gap-3 shrink-0 transition-colors duration-300"
          style={{ color: theme.text }}
        >
          <h2 className="font-medium">{currentTime}</h2>
        </div>

        <div className="flex-1 overflow-hidden mx-8">
          <div className="whitespace-nowrap">
            <p
              className="text-lg font-medium inline-block marquee-text transition-colors duration-300"
              style={{
                color: theme.textSoft,
              }}
            >
              Seluruh pelayanan di Puskesmas Masjid Raya ditangani oleh Dokter, Perawat, dan
              Staf yang profesional serta ramah dalam melayani pasien.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            className="size-10 flex items-center justify-center rounded-xl transition-all duration-300"
            style={{
              backgroundColor: theme.buttonBg,
              border: `1px solid ${theme.buttonBorder}`,
            }}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#FFFFFF" }}>
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.536a1 1 0 010 1.414l-.707.707A1 1 0 012.93 15.243l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm1.757-6.657a1 1 0 10-1.414-1.414l-.707.707A1 1 0 105.05 5.05l.707-.707z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#6B7280" }}>
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleBack}
            className="px-5 py-2 rounded-xl flex items-center gap-2 text-white font-medium transition-all duration-300"
            style={{
              backgroundColor: isDark ? "#313337" : "#DC2626",
              border: isDark ? "1px solid #404145" : "1px solid #B91C1C",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </footer>

      <style jsx>{`
        .marquee-text {
          animation: marquee 25s linear infinite;
        }

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
  );
}