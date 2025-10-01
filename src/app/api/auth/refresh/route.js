import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // ✅ Correct way to retrieve cookies
    const cookieStore = await cookies();
    const wpRefreshToken = cookieStore.get('wpRefreshToken')?.value;

    console.log("🔄 Refresh route - WordPress refresh token exists:", !!wpRefreshToken);

    if (!wpRefreshToken) {
      console.log("❌ No WordPress refresh token found");
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 200 }
      );
    }

    // ✅ Use WordPress refresh token to get new auth token
    console.log("🔄 Requesting new WordPress auth token...");
    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) {
              authToken
              refreshToken
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
            refreshToken: wpRefreshToken,
          },
        },
      }),
    });

    const data = await response.json();
    console.log("🔄 WordPress refresh response:", data);

    if (data?.data?.refreshToken?.authToken) {
      // ✅ Set the new WordPress auth token in cookies
      const result = NextResponse.json({ success: true, newAuthToken: data.data.refreshToken.authToken });
      
      cookieStore.set('authToken', data.data.refreshToken.authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      // Update the refresh token if WordPress provides a new one
      if (data.data.refreshToken.refreshToken) {
        cookieStore.set('wpRefreshToken', data.data.refreshToken.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
      }

      console.log("✅ New WordPress auth token set successfully");
      return result;
    } else {
      console.log("❌ WordPress refresh failed:", data.errors || data);
      return NextResponse.json(
        { success: false, message: 'Failed to refresh WordPress token' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh token' },
      { status: 200 }
    );
  }
}
