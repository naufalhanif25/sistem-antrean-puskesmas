"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/me");

            if (!res.ok) {
                router.push("/");
            }
        };

        checkAuth();
    }, []);

    redirect("/admin/pendaftaran");
}
