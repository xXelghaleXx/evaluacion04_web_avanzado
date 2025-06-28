import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { getAuthenticatedUser } from '@/middleware/auth';
import User from '@/models/User';

// GET - Obtener perfil del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findByPk(currentUser.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
