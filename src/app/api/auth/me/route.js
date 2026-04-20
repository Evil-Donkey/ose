import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 200 });
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetCurrentUser {
            viewer {
              id
              username
              email
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data?.data?.viewer) {
      return NextResponse.json({ success: true, user: data.data.viewer }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 200 });
  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json({ success: false, message: "Auth check failed" }, { status: 200 });
  }
}