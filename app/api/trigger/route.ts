import { NextResponse } from 'next/server';

const API_ORIGIN = 'https://api.allocatespace.co';
const SCENE_ID = '06cbf54f-c1ac-4e58-b997-ccae7c6c7203';

export async function POST() {
  const email = process.env.ALLOCATE_EMAIL;
  const password = process.env.ALLOCATE_PASSWORD;
  if (!email || !password) {
    console.error('Allocate Space credentials are not configured.');
    return NextResponse.json({ message: 'The door service is not configured. Please contact the event team.' }, { status: 503 });
  }

  try {
    const loginResponse = await fetch(`${API_ORIGIN}/api/dcwdemo/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
    if (!loginResponse.ok) {
      console.error('Allocate Space login failed:', loginResponse.status);
      return NextResponse.json({ message: 'We could not connect to the door. Please try again.' }, { status: 502 });
    }
    const loginBody = (await loginResponse.json()) as { data?: { accessToken?: string } };
    const accessToken = loginBody.data?.accessToken;
    if (!accessToken) {
      console.error('Allocate Space login response did not include an access token.');
      return NextResponse.json({ message: 'We could not verify access. Please try again.' }, { status: 502 });
    }

    const sceneResponse = await fetch(`${API_ORIGIN}/api/dcwdemo/scenes/${SCENE_ID}/triggerScene`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!sceneResponse.ok) {
      console.error('Allocate Space scene trigger failed:', sceneResponse.status);
      return NextResponse.json({ message: 'The door did not respond. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ message: 'The door is open.' });
  } catch (error) {
    console.error('Allocate Space request failed:', error);
    return NextResponse.json({ message: 'There is a connection issue. Please try again.' }, { status: 502 });
  }
}
