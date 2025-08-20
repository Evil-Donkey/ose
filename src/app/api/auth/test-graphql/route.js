import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Testing GraphQL connection...");
    console.log("🧪 Endpoint:", process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT);

    const testQuery = `
      query TestConnection {
        __schema {
          types {
            name
          }
        }
      }
    `;

    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: testQuery
      }),
    });

    console.log("🧪 Response status:", response.status);
    console.log("🧪 Response ok:", response.ok);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      }, { status: 500 });
    }

    const data = await response.json();
    console.log("🧪 GraphQL Response:", JSON.stringify(data, null, 2));

    if (data.errors) {
      return NextResponse.json({
        success: false,
        message: "GraphQL Error: " + data.errors[0]?.message,
        errors: data.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "GraphQL connection successful",
      schemaTypes: data.data?.__schema?.types?.length || 0
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Test Error:", error);
    return NextResponse.json({
      success: false,
      message: "Test failed: " + error.message
    }, { status: 500 });
  }
}
