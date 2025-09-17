import { NextResponse } from "next/server";

export async function POST(req) {
  const { firstName, lastName, email, organisation, organisationRole, recaptchaToken } = await req.json();
  const username = email.split('@')[0];

  // Verify reCAPTCHA token
  if (recaptchaToken) {
    try {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }),
      });

      const recaptchaData = await recaptchaResponse.json();
      
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ 
          error: "reCAPTCHA verification failed. Please try again." 
        }, { status: 400 });
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return NextResponse.json({ 
        error: "reCAPTCHA verification failed. Please try again." 
      }, { status: 400 });
    }
  } else {
    return NextResponse.json({ 
      error: "reCAPTCHA token is required" 
    }, { status: 400 });
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation RegisterUserWithoutPassword(
            $username: String!,
            $email: String!,
            $firstName: String!,
            $lastName: String!,
            $organisation: String!,
            $organisationRole: String!
          ) {
            registerUserWithoutPassword(input: { 
              username: $username,
              email: $email,
              firstName: $firstName,
              lastName: $lastName,
              organisation: $organisation,
              organisationRole: $organisationRole
            }) {
              user {
                id
                username
                email
                firstName
                lastName
                organisation
                organisationRole
              }
              message
            }
          }
        `,
        variables: { firstName, lastName, email, organisation, organisationRole, username },
      }),
    });
     

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 400 });
    }

    return NextResponse.json(data.data.registerUserWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
