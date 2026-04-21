import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatNomorDisplay } from "@/lib/antrean";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const { role } = body;
        const parsedId = parseInt(id);

        if (role !== "ADMIN") {
            return NextResponse.json(
                { message: "Role tidak valid" },
                { status: 400 },
            );
        }
        if (isNaN(parsedId)) {
            return NextResponse.json(
                { message: "ID tidak valid" },
                { status: 400 },
            );
        }
        const existing = await prisma.antrean.findUnique({
            where: { id: parsedId },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Data tidak ditemukan" },
                { status: 404 },
            );
        }
        await prisma.antrean.delete({
            where: { id: parsedId },
        });

        const nomorDisplay = formatNomorDisplay(
            existing.kodeRuangan,
            existing.nomorAntrean,
        );

        return NextResponse.json({
            message: "Data berhasil dihapus",
            nomorDisplay
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menghapus antrean", error: String(error) },
            { status: 500 },
        );
    }
}