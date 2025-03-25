import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
    expires: new Date(0), // Expire immediately
  });
  
  console.log("✅ Logout successful, authToken cleared");
  return response;
}