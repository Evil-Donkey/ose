import { NextResponse } from "next/server";

export async function GET() {
  const debugInfo = {
    accessTokenSecret: !!process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: !!process.env.REFRESH_TOKEN_SECRET,
    wordpressEndpoint: !!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  console.log("🔍 Debug endpoint called:", debugInfo);

  return NextResponse.json(debugInfo);
} 