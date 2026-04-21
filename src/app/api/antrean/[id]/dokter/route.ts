import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatNomorDisplay } from "@/lib/antrean";
import { statusOrder } from "@/app/data/StatusOrder";

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
            createdAt: item.createdAt,
        })).sort((a, b) => {
            const statusA = statusOrder[a.status] || 999;
            const statusB = statusOrder[b.status] || 999;

            if (statusA !== statusB) {
                return statusA - statusB;
            }
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return NextResponse.json({ queue: queueData });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal mengambil data", error: String(error) },
            { status: 500 },
        );
    }
}