import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatNomorDisplay } from "@/lib/antrean";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.antrean.findUnique({
      where: { id: parsedId },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.antrean.update({
      where: { id: parsedId },
      data: {
        status: "Menunggu", // 🔥 kembali ke antrean / dilewati
      },
    });

    const nomorDisplay = formatNomorDisplay(
      existing.kodeRuangan,
      existing.nomorAntrean
    );

    return NextResponse.json({
      message: "Berhasil lewati",
      nomorDisplay,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal lewati", error: String(error) },
      { status: 500 }
    );
  }
}