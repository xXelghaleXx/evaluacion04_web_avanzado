import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';
import User from '../models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

// Middleware para verificar autenticación
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario existe y está activo
    const user = await User.findByPk(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Usuario no encontrado o inactivo' },
        { status: 401 }
      );
    }

    // Agregar información del usuario al request
    // Nota: En Next.js no podemos modificar directamente el request,
    // por lo que pasaremos la información del usuario de otra manera
    
    return null; // Continuar con el request
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función helper para obtener usuario autenticado
export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader || '');

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const user = await User.findByPk(payload.userId);
  if (!user || !user.isActive) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

// Middleware para verificar rol de administrador
export async function adminMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const authResponse = await authMiddleware(request);
  if (authResponse) {
    return authResponse; // Error de autenticación
  }

  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Acceso denegado. Se requieren permisos de administrador.' },
      { status: 403 }
    );
  }

  return null; // Continuar con el request
}
