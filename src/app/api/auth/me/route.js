import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log("authToken:", authToken);
  console.log("refreshToken:", refreshToken);

  if (!authToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  // Proceed with fetching the user data
  const response = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT, {
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
  console.log("WordPress response:", data);

  if (data?.data?.viewer) {
    return NextResponse.json({ success: true, user: data.data.viewer }, { status: 200 });
  } else {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}