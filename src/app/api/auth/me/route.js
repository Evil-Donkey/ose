import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const wpRefreshToken = cookieStore.get("wpRefreshToken")?.value;

  console.log("🔍 /me route - authToken exists:", !!authToken);
  console.log("🔍 /me route - WordPress refresh token exists:", !!wpRefreshToken);

  if (!authToken) {
    console.log("❌ No auth token found");
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 200 });
  }

  // Proceed with fetching the user data
  console.log("🔍 Making WordPress GraphQL request with token...");
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
  } else {
    // Check if it's a token expiration error
    if (data?.errors?.[0]?.message?.includes('expired') || 
        data?.errors?.[0]?.message?.includes('invalid') ||
        response.status === 401) {
      console.log("🔄 Token appears to be expired, should trigger refresh");
    }
    
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 200 });
  }
}