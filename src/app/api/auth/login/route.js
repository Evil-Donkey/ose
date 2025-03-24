import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const response = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation LoginUser($input: LoginInput!) {
            login(input: $input) {
              authToken
              user {
                id
                username
                email
              }
            }
          }
        `,
        variables: {
          input: {
            credentials: {
              username,
              password
            },
            provider: "PASSWORD",
          },
        },
      }),
    });

    const text = await response.text();
    console.log("📜 WordPress GraphQL Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("❌ JSON Parse Error:", error);
      return NextResponse.json({ success: false, message: "Invalid server response" }, { status: 500 });
    }

    if (data?.data?.login?.authToken) {
      // ✅ Await `cookies()` before setting the cookie
      const cookieStore = await cookies();
      cookieStore.set("authToken", data.data.login.authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return NextResponse.json({ success: true, user: data.data.login.user });
    } else {
      console.error("❌ Login failed: ", data.errors || data);
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
