import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { nip, password, role } = await req.json();

    if (!nip || !password || !role) {
      return NextResponse.json(
        { message: "NIP, password, dan role harus diisi" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan NIP dan role
    const user = await prisma.user.findUnique({
      where: { nip },
    });

    if (!user) {
      return NextResponse.json(
        { message: "NIP atau password salah" },
        { status: 401 }
      );
    }

    // Cek apakah role sesuai
    if (user.role !== role) {
      return NextResponse.json(
        { message: "Role tidak sesuai" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "NIP atau password salah" },
        { status: 401 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          nip: user.nip,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set cookie untuk session
    response.cookies.set("auth_token", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
