import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: Request) {
    const token = req.headers.get("cookie")?.split("token=")[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { payload } = await jwtVerify(token, secret);
        
        return NextResponse.json(payload);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
