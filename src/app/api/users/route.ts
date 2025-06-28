import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { getAuthenticatedUser, adminMiddleware } from '@/middleware/auth';

// GET - Obtener todos los usuarios (solo admins)
export async function GET(request: NextRequest) {
  try {
    // Verificar que sea admin
    const authError = await adminMiddleware(request);
    if (authError) return authError;

    await connectDB();

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (solo admins)
export async function POST(request: NextRequest) {
  try {
    // Verificar que sea admin
    const authError = await adminMiddleware(request);
    if (authError) return authError;

    await connectDB();

    const { email, password, firstName, lastName, role = 'user' } = await request.json();

    // Validaciones
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Crear usuario
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      
      return NextResponse.json(
        { error: 'Errores de validación', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
