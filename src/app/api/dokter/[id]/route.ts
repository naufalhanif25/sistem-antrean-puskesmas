import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        const doctor = await prisma.user.findUnique({
            where: { id: parsedId },
        });

        if (!doctor || doctor.role !== "DOKTER") {
            return NextResponse.json(
                { error: "Dokter tidak ditemukan" },
                { status: 404 },
            );
        }

        await prisma.user.delete({
            where: { id: parsedId },
        });

        return NextResponse.json({
            message: "Dokter berhasil dihapus",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal menghapus dokter", error: String(error) },
            { status: 500 },
        );
    }
}
