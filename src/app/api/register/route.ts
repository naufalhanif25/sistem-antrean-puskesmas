import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/app/props/UserData";
import { isAllNumber } from "@/lib/validator";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nip, nama, password, role, cluster } = body;

        if (!nip || !password || !role) {
            return NextResponse.json(
                { error: "Semua field wajib diisi" },
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
                { error: "Password minimal 8 karakter" },
                { status: 400 },
            );
        }

        const validRoles: UserRole[] = ["ADMIN", "DOKTER", "LAYAR"];
        
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: "Role tidak valid" },
                { status: 400 },
            );
        }
        let clusterValue: number | null = null;
        let namaValue: string | null = null;

        if (role === "DOKTER") {
            if (!nama) {
                return NextResponse.json(
                    { error: "Nama wajib diisi untuk dokter" },
                    { status: 400 },
                );
            }
            namaValue = nama;

            if (cluster === undefined || cluster === null) {
                return NextResponse.json(
                    { error: "Cluster wajib dipilih untuk dokter" },
                    { status: 400 },
                );
            }
            const parsedCluster = parseInt(cluster);
            if (![1, 2, 3, 4].includes(parsedCluster)) {
                return NextResponse.json(
                    { error: "Cluster tidak valid, pilih 1 sampai 4" },
                    { status: 400 },
                );
            }
            clusterValue = parsedCluster;
        } else {
            namaValue = nama || null;
        }

        const existingUser = await prisma.user.findUnique({ where: { nip } });

        if (existingUser) {
            return NextResponse.json(
                { error: "NIP sudah terdaftar" },
                { status: 409 },
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                nip,
                nama: namaValue,
                password: hashedPassword,
                role,
                cluster: clusterValue,
            },
        });

        return NextResponse.json(
            {
                message: "Registrasi berhasil",
                user: {
                    id: newUser.id,
                    nip: newUser.nip,
                    nama: newUser.nama,
                    role: newUser.role,
                    cluster: newUser.cluster,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Gagal register", error: String(error) },
            { status: 500 },
        );
    }
}
