// app/api/authenticate/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { alias } = await req.json(); // Get alias from request body
  const url = `https://2349-210-89-54-148.ngrok-free.app/api/v1/getauthtoken?url=https://test.salesforce.com&alias=${alias}`;

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // console.log(response.text());
     
    if (response.ok) {
      const data = await response.json(); // Assuming the response is JSON
      console.log(data);
      return NextResponse.json(data); // Return data
    } else {
      return NextResponse.json({ message: 'Failed to authenticate.' }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to authenticate.' }, { status: 500 });
  }
}
