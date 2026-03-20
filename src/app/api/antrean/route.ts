import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatNomorDisplay } from "@/lib/antrean";
import { statusOrder } from "@/app/props/UserData";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nik, namaLengkap, jenisKelamin, kodeRuangan } = body;

        if (!nik || !namaLengkap || !jenisKelamin || !kodeRuangan) {
            return NextResponse.json(
                { message: "Data tidak lengkap" },
                { status: 400 },
            );
        }
        const counter = await prisma.counter.upsert({
            where: { kodeRuangan },
            update: {
                lastNumber: { increment: 1 },
            },
            create: {
                kodeRuangan,
                lastNumber: 1,
            },
        });
        const nextNumber = counter.lastNumber;

        await prisma.antrean.create({
            data: {
                nik,
                namaLengkap,
                jenisKelamin,
                kodeRuangan,
                nomorAntrean: nextNumber,
            },
        });

        const nomorDisplay = formatNomorDisplay(kodeRuangan, nextNumber);

        return NextResponse.json({
            message: "Berhasil tambah antrean",
            nomorAntrean: nextNumber,
            nomorDisplay,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menambah antrean", error: String(error) },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        const queue = await prisma.antrean.findMany({
            orderBy: { createdAt: "asc" },
        });
        const doctors = await prisma.user.findMany({
            where: { role: "DOKTER" },
            select: {
                id: true,
                nama: true,
                cluster: true,
            },
        });
        const queueData = queue.map((item) => ({
            id: item.id,
            queueNumber: formatNomorDisplay(
                item.kodeRuangan,
                item.nomorAntrean,
            ),
            patientName: item.namaLengkap,
            status: item.status,
            cluster: item.kodeRuangan,
            createdAt: item.createdAt,
        })).sort((a, b) => {
            const statusA = statusOrder[a.status] || 999;
            const statusB = statusOrder[b.status] || 999;

            if (statusA !== statusB) {
                return statusA - statusB;
            }
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return NextResponse.json({ queue: queueData, doctors });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal ambil data", error: String(error) },
            { status: 500 },
        );
    }
}
