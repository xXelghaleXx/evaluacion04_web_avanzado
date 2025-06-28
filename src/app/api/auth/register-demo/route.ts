import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Register endpoint funcionando',
      user: {
        id: 2,
        email: 'nuevo@example.com',
        firstName: 'Nuevo',
        lastName: 'Usuario',
        role: 'user',
        isActive: true
      },
      token: 'demo-jwt-token'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
