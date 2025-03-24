import { NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(req) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const authToken = cookies.authToken;

  if (!authToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const response = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
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
  } else {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
