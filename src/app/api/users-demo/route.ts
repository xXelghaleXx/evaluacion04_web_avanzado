import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      users: [
        { id: 1, email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
        { id: 2, email: 'user@example.com', firstName: 'Regular', lastName: 'User', role: 'user' }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Usuario creado',
      user: { id: 3, email: 'nuevo@example.com', firstName: 'Nuevo', lastName: 'Usuario' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
