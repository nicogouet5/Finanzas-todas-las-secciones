import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/admin-session";
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set("hub_admin", "", { ...sessionCookie, maxAge: 0 }); return response; }
