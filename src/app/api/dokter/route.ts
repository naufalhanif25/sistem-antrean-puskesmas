import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const doctors = await prisma.user.findMany({
            where: { role: "DOKTER" },
            select: {
                id: true,
                nama: true,
                cluster: true,
            },
        });

        return NextResponse.json({ doctors });
    }
    catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data dokter", error: String(error) },
            { status: 500 },
        );
    }
}