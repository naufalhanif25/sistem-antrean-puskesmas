import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl;

    if (url.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, secret);

            // 🔐 cek role
            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }

        } catch {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};