"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/me");

            if (!res.ok) {
                router.replace("/");
            } else {
                router.replace("/dokter/antrean");
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="flex h-screen bg-white"></div>
    );
}
