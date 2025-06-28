import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Login endpoint funcionando',
      user: {
        id: 1,
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        isActive: true
      },
      token: 'demo-jwt-token'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
