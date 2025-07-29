import { NextResponse } from "next/server";

export async function POST(req) {
  const { firstName, lastName, email, organisation, organisationRole } = await req.json();
  const username = email.split('@')[0];

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
