import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl;

    if (url.pathname === "/") {
        if (!token) return;
        try {
            const { payload } = await jwtVerify(token, secret);
            switch (payload.role) {
                case "ADMIN":
                    return NextResponse.redirect(new URL("/admin", req.url));
                case "DOKTER":
                    return NextResponse.redirect(new URL("/dokter", req.url));
                case "LAYAR":
                    return NextResponse.redirect(new URL("/layar", req.url));
                default:
                    return;
            }
        } catch {
            return;
        }
    }
    if (url.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        try {
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            } else if (url.pathname == "/admin") {
                return NextResponse.redirect(new URL("/admin/pendaftaran", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    if (url.pathname.startsWith("/dokter")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        try {
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== "DOKTER") {
                return NextResponse.redirect(new URL("/", req.url));
            } else if (url.pathname == "/dokter") {
                return NextResponse.redirect(new URL("/dokter/antrean", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    if (url.pathname.startsWith("/layar")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        try {
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== "LAYAR" && payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/admin", "/admin/:path*", 
        "/dokter", "/dokter/:path*",
        "/layar"
    ],
};
