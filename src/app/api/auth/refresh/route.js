import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Load environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export async function POST(req) {
  try {
    // ✅ Correct way to retrieve cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value; // Ensure you get the token's value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // ✅ Verify refresh token
    const decoded = jwt.verify(refreshToken, ACCESS_TOKEN_SECRET);

    // ✅ Generate a new access token
    const newAuthToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h', // Adjust expiration as needed
    });

    // ✅ Set the new auth token in cookies
    const response = NextResponse.json({ success: true, newAuthToken });
    
    cookieStore.set('authToken', newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    console.log("✅ Refresh Token Processed:", decoded);

    return response;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh token' },
      { status: 401 }
    );
  }
}
