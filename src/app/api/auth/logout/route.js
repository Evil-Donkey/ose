import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  // ✅ Await cookies() before using it
  const cookieStore = await cookies();
  
  // ✅ Clear the authToken cookie by setting an expired date
  cookieStore.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
