import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: "Email is required" 
      }, { status: 400 });
    }

    console.log("🔍 Checking email existence:", email);

    const wpGraphQLEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
    const wpBaseUrl = wpGraphQLEndpoint.replace('/graphql', '');

    // Use custom WordPress REST API endpoint
    try {
      const customEndpointResponse = await fetch(`${wpBaseUrl}/wp-json/email-check/v1/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("📜 Custom endpoint response status:", customEndpointResponse.status);
      
      if (customEndpointResponse.ok) {
        const result = await customEndpointResponse.json();
        console.log("📜 Custom endpoint result:", JSON.stringify(result, null, 2));
        
        if (result.success) {
          console.log("✅ Email check completed:", result.message);
          return NextResponse.json(result);
        }
      } else {
        console.log("⚠️ Custom endpoint failed:", customEndpointResponse.status);
        const errorText = await customEndpointResponse.text();
        console.log("⚠️ Error response:", errorText);
      }
    } catch (customError) {
      console.log("⚠️ Custom endpoint error:", customError.message);
    }

    // Fallback: If custom endpoint fails, return generic error
    console.log("❌ Email check failed for:", email);
    return NextResponse.json({ 
      success: false, 
      message: "Unable to check email at this time. Please try again later." 
    }, { status: 500 });

  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
