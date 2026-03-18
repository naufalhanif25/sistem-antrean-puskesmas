import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { nip, password, role } = await req.json();

        const user = await prisma.user.findUnique({
            where: { nip },
        });

        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return NextResponse.json({ error: "Password salah" }, { status: 401 });
        }

        if (user.role !== role) {
            return NextResponse.json({ error: "Role tidak sesuai" }, { status: 403 });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "30m" }
        );

        const response = NextResponse.json({ role: user.role });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 30, // 30 menit
            sameSite: "strict",
        });

        return response;

    } catch {
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}