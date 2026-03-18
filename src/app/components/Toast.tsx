"use client";

import { useEffect, useState } from "react";
import { subscribe, removeToast } from "@/lib/toast";

export default function ToastContainer() {
    const [toasts, setToasts] = useState<any[]>([]);

    useEffect(() => {
        return subscribe(setToasts);
    }, []);

    return (
        <div className="fixed top-5 right-5 space-y-3 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="relative w-80 rounded-lg overflow-hidden shadow-lg border"
                    style={{
                        backgroundColor:
                            toast.type === "success" ? "#ECFDF5" : "#FEF2F2",
                        borderColor:
                            toast.type === "success" ? "#10B981" : "#EF4444",
                    }}
                >
                    {/* isi */}
                    <div className="p-4 flex justify-between items-start">
                        <p
                            className="text-sm font-medium"
                            style={{
                                color:
                                    toast.type === "success"
                                        ? "#065F46"
                                        : "#991B1B",
                            }}
                        >
                            {toast.message}
                        </p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-3 text-xs"
                        >
                            ✕
                        </button>
                    </div>

                    {/* progress bar */}
                    <div className="h-1 w-full bg-gray-200">
                        <div
                            className="h-1"
                            style={{
                                width: "100%",
                                backgroundColor:
                                    toast.type === "success"
                                        ? "#10B981"
                                        : "#EF4444",
                                animation: "grow 3s linear forwards",
                            }}
                        />
                    </div>
                </div>
            ))}

            <style jsx>{`
                @keyframes grow {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}