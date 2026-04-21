import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAllNumber } from "@/lib/validator";

export async function POST(req: Request) {
    try {
        const { nip, password, role } = await req.json();

        if (!nip || !password || !role) {
            return NextResponse.json(
                { message: "Data tidak lengkap" },
                { status: 400 },
            );
        }
        if (nip.length < 18 || !isAllNumber(nip)) {
            return NextResponse.json(
                { message: "NIP tidak valid" },
                { status: 400 },
            );
        }
        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password tidak valid" },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { nip },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User tidak ditemukan" },
                { status: 404 },
            );
        }
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return NextResponse.json(
                { error: "Password salah" },
                { status: 401 },
            );
        }
        if (user.role !== role) {
            return NextResponse.json(
                { error: "Role tidak sesuai" },
                { status: 403 },
            );
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "30m" },
        );
        const response = NextResponse.json({ 
            cluster: user.cluster, 
            role: user.role, name: 
            user.nama, nip: user.nip 
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 30,
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal login", error: String(error) },
            { status: 500 },
        );
    }
}
