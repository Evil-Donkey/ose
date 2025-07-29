import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { key, login, newPassword } = await req.json();

    if (!key || !login || !newPassword) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const query = `
      mutation ResetUserPassword($key: String!, $login: String!, $password: String!) {
        resetUserPassword(input: { key: $key, login: $login, password: $password }) {
          user {
            id
          }
        }
      }
    `;

    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { key, login, password: newPassword } }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("❌ GraphQL Error:", json.errors[0]?.message);
      return NextResponse.json({
        success: false,
        message: json.errors[0]?.message || "Failed to reset password. The link may have expired.",
      }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
