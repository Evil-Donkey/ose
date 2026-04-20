import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

// Clears the auth/refresh cookies so a stale or invalid refresh token
// doesn't keep triggering the refresh flow on every page load.
function clearAuthCookies(response) {
  const expired = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Strict',
    path: '/',
    maxAge: 0,
  };
  response.cookies.set('authToken', '', expired);
  response.cookies.set('wpRefreshToken', '', expired);
  return response;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const wpRefreshToken = cookieStore.get('wpRefreshToken')?.value;

    if (!wpRefreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 200 }
      );
    }

    // WPGraphQL JWT's refreshToken mutation payload only exposes `authToken`.
    // Earlier versions also returned `refreshToken` / `user`, but those were
    // removed — requesting them causes WordPress to reject the whole mutation
    // with "Cannot query field" errors.
    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) {
              authToken
            }
          }
        `,
        variables: {
          input: { refreshToken: wpRefreshToken },
        },
      }),
    });

    const data = await response.json();
    const newAuthToken = data?.data?.refreshToken?.authToken;

    if (newAuthToken) {
      const result = NextResponse.json({ success: true });
      result.cookies.set('authToken', newAuthToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'Strict',
        maxAge: 60 * 60,
        path: '/',
      });
      return result;
    }

    // Refresh failed — the refresh token is stale/invalid. Clear both cookies
    // so the client doesn't keep calling /api/auth/refresh on every page load.
    if (data?.errors?.length) {
      console.warn(
        'WordPress refresh failed:',
        data.errors.map((e) => e?.message).filter(Boolean).join(' | ')
      );
    }

    return clearAuthCookies(
      NextResponse.json(
        { success: false, message: 'Failed to refresh WordPress token' },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error('Error refreshing token:', error);
    return clearAuthCookies(
      NextResponse.json(
        { success: false, message: 'Failed to refresh token' },
        { status: 200 }
      )
    );
  }
}
