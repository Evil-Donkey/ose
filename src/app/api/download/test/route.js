import { NextResponse } from "next/server";

export async function GET() {
  // This is a test endpoint to verify the download route is working
  return NextResponse.json({ 
    message: 'Download endpoint is working',
    testUrl: '/api/download?url=https://oxfordscienceenterprises-cms.com/wp-content/uploads/protected/2025/08/placeholder-4.pdf'
  });
}
