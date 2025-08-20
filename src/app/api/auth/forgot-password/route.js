import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🚀 Forgot password API called");
    
    const { email } = await req.json();
    console.log("📧 Email received:", email);

    if (!email) {
      console.error("❌ Missing email field");
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    // First, check if user exists and get their status using GraphQL
    console.log("📧 Making GraphQL request to check user existence and status");
    
    const userQuery = `
      query GetUserByEmail($email: String!) {
        users(first: 1000, where: {search: $email}) {
          nodes {
            id
            userStatus
          }
        }
      }
    `;

    const userResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: userQuery,
        variables: { email }
      }),
    });

    console.log("📧 Response status:", userResponse.status);
    console.log("📧 Response ok:", userResponse.ok);

    if (!userResponse.ok) {
      console.error("❌ HTTP Error:", userResponse.status, userResponse.statusText);
      return NextResponse.json({
        success: false,
        message: "Failed to connect to WordPress.",
      }, { status: 500 });
    }

    let userData;
    try {
      userData = await userResponse.json();
    } catch (error) {
      console.error("❌ JSON Parse Error:", error);
      return NextResponse.json({
        success: false,
        message: "Invalid response from WordPress.",
      }, { status: 500 });
    }

    if (userData.errors) {
      console.error("❌ GraphQL Error:", userData.errors[0]?.message);
      return NextResponse.json({
        success: false,
        message: "Failed to check user status.",
      }, { status: 400 });
    }

    console.log("📧 GraphQL Response:", JSON.stringify(userData, null, 2));
    
    const users = userData.data?.users?.nodes || [];
    
    // If no users found, email doesn't exist
    if (users.length === 0) {
      console.log("📧 No users found for email:", email);
      return NextResponse.json({ 
        success: true, 
        message: "email_not_found",
        status: "not_found"
      }, { status: 200 });
    }

    // Get the first user (should be the one with the matching email)
    const user = users[0];
    const userStatus = user.userStatus || 'pending';
    
    console.log("📧 User found, Status:", userStatus);

    // Handle different user statuses
    if (userStatus === 'denied') {
      console.log("📧 User denied");
      return NextResponse.json({ 
        success: true, 
        message: "not_approved",
        status: "denied"
      }, { status: 200 });
    }

    if (userStatus === 'pending') {
      console.log("📧 User pending");
      return NextResponse.json({ 
        success: true, 
        message: "not_approved",
        status: "pending"
      }, { status: 200 });
    }

    if (userStatus === 'approved') {
      console.log("📧 User approved, proceeding with password reset");
    } else {
      console.log("📧 Unknown user status:", userStatus);
      return NextResponse.json({ 
        success: true, 
        message: "not_approved",
        status: "unknown"
      }, { status: 200 });
    }

    // Send password reset email using WordPress GraphQL (following Mike Jolley's approach)
    console.log("📧 Sending password reset email using GraphQL mutation");
    
    const resetQuery = `
      mutation SendPasswordResetEmail($input: SendPasswordResetEmailInput!) {
        sendPasswordResetEmail(input: $input) {
          clientMutationId
        }
      }
    `;

    const resetResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: resetQuery, 
        variables: { 
          input: { 
            username: email // Use email as username (GraphQL accepts email addresses)
          } 
        } 
      }),
    });

    const resetData = await resetResponse.json();
    console.log("📧 Reset Response:", JSON.stringify(resetData, null, 2));

    if (resetData.errors) {
      console.error("❌ Password Reset Email Error:", resetData.errors[0]?.message);
      return NextResponse.json({
        success: false,
        message: "Failed to send password reset email.",
      }, { status: 400 });
    }

    console.log("✅ Password reset email sent successfully to:", email);
    return NextResponse.json({ 
      success: true, 
      message: "reset_sent",
      status: "approved"
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
