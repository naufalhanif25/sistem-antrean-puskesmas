"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { showToast } from "@/lib/toast";

export default function PendaftaranPage() {
  const [isDark, setIsDark] = useState(false);
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kodeRuangan, setKodeRuangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBatalPressed, setIsBatalPressed] = useState(false);
  const [isAntreanPressed, setIsAntreanPressed] = useState(false);

  const handleReset = () => {
    setNik("");
    setNamaLengkap("");
    setJenisKelamin("");
    setKodeRuangan("");
  };

  const handleSubmitAntrean = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/antrean", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik,
          namaLengkap,
          jenisKelamin,
          kodeRuangan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Gagal tambah antrean", "error");
      }

      showToast("Antrean berhasil ditambahkan", "success");

      handleReset();

    //   alert(`Nomor antrean: ${data.nomorAntrean}`);
      showToast(`Nomor antrean: ${data.nomorDisplay}`, "success");

    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Terjadi kesalahan", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
              Pendaftaran
            </h1>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: isDark ? "#1F1F1F" : "#FFFFFF",
              border: isDark ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
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
              Form untuk mendaftarkan pasien baru dan mengambil nomor antrean
              sesuai cluster atau dokter tujuan.
            </p>
          </div>
          <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[calc(100vh-220px)]">
            <div
              className="w-full rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                border: isDark ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
              }}
            >
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? "#0D0D0D" : "#F3F4F6",
                    border: isDark ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
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
                    style={{
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    }}
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
              </div>
              <h2
                className="text-2xl font-bold text-center mb-8 transition-colors duration-300"
                style={{
                  color: isDark ? "#FFFFFF" : "#111827",
                }}
              >
                Tambah Antrean
              </h2>
              <form onSubmit={handleSubmitAntrean} className="space-y-5">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium transition-colors duration-300"
                    style={{
                      color: isDark ? "#E5E7EB" : "#374151",
                    }}
                  >
                    Nomor Induk Kependudukan
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Masukkan Nomor Induk Kependudukan"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label
                      className="block mb-2 text-sm font-medium transition-colors duration-300"
                      style={{
                        color: isDark ? "#E5E7EB" : "#374151",
                      }}
                    >
                      Nama Lengkap Pasien
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Masukkan nama lengkap pasien"
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
                      style={{
                        color: isDark ? "#E5E7EB" : "#374151",
                      }}
                    >
                      J. Kelamin
                    </label>
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value)}
                      className="w-full rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 appearance-none bg-no-repeat"
                      style={{
                        backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                        border: isDark
                          ? "1px solid #2A2A2A"
                          : "1px solid #D1D5DB",
                        color: jenisKelamin
                          ? isDark
                            ? "#FFFFFF"
                            : "#111827"
                          : "#9CA3AF",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                          isDark ? "%239CA3AF" : "%236B7280"
                        }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: "1rem",
                        backgroundPosition: "right 0.75rem center",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="" disabled>
                        J. Kelamin
                      </option>
                      <option value="L">Laki-Laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium transition-colors duration-300"
                    style={{
                      color: isDark ? "#E5E7EB" : "#374151",
                    }}
                  >
                    Pilih Kode Ruagan
                  </label>
                  <select
                    value={kodeRuangan}
                    onChange={(e) => setKodeRuangan(e.target.value)}
                    required
                    className="w-full rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 appearance-none bg-no-repeat"
                    style={{
                      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
                      border: isDark
                        ? "1px solid #2A2A2A"
                        : "1px solid #D1D5DB",
                      color: kodeRuangan
                        ? isDark
                          ? "#FFFFFF"
                          : "#111827"
                        : "#9CA3AF",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${
                        isDark ? "%239CA3AF" : "%236B7280"
                      }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundSize: "1rem",
                      backgroundPosition: "right 0.75rem center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    {/* FIXME: Sesuaikan dengan daftar cluster dari API */}
                    <option value="" disabled>
                      Kode Ruangan
                    </option>
                    <option value="cluster1">Cluster 1</option>
                    <option value="cluster2">Cluster 2</option>
                    <option value="cluster3">Cluster 3</option>
                    <option value="cluster4">Cluster 4</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    onMouseDown={() => setIsBatalPressed(true)}
                    onMouseUp={() => setIsBatalPressed(false)}
                    onMouseLeave={() => setIsBatalPressed(false)}
                    className="py-3 rounded-lg font-medium transition-all duration-150"
                    style={{
                      backgroundColor: isBatalPressed
                        ? isDark
                          ? "#1A1A1A"
                          : "#F3F4F6"
                        : "transparent",
                      border: isDark
                        ? "1px solid #2A2A2A"
                        : "1px solid #D1D5DB",
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    onMouseDown={() => setIsAntreanPressed(true)}
                    onMouseUp={() => setIsAntreanPressed(false)}
                    onMouseLeave={() => setIsAntreanPressed(false)}
                    disabled={isLoading}
                    className="py-3 rounded-lg font-medium transition-all duration-150"
                    style={{
                      backgroundColor: isLoading
                        ? isDark
                          ? "#2A2A2A"
                          : "#FCA5A5"
                        : isAntreanPressed
                          ? isDark
                            ? "#262A2E"
                            : "#B91C1C"
                          : isDark
                            ? "#313337"
                            : "#DC2626",
                      border: isDark
                        ? isLoading
                          ? "1px solid #1F1F1F"
                          : "1px solid #404145"
                        : "1px solid #DC2626",
                      color: isLoading
                        ? isDark
                          ? "#6B7280"
                          : "#FFFFFF"
                        : "#FFFFFF",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.6 : 1,
                      boxShadow:
                        !isLoading && !isDark
                          ? "0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -2px rgba(220, 38, 38, 0.2)"
                          : "none",
                    }}
                  >
                    Tambah Antrean
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
