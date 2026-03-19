import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatNomorDisplay } from "@/lib/antrean";

export async function GET(
    req: Request, 
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const queue = await prisma.antrean.findMany({
            orderBy: { createdAt: "asc" },
            where: {
                kodeRuangan: `cluster${id}`
            }
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
        }));

        return NextResponse.json({ queue: queueData });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal ambil data", error: String(error) },
            { status: 500 },
        );
    }
}