import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { getAuthenticatedUser, adminMiddleware } from '@/middleware/auth';

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const userId = parseInt(id);
    
    // Los usuarios solo pueden ver su propio perfil, los admins pueden ver cualquiera
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const user = await User.findByPk(userId, {
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
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const userId = parseInt(id);
    const updateData = await request.json();

    // Los usuarios solo pueden actualizar su propio perfil, los admins pueden actualizar cualquiera
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Solo los admins pueden cambiar el rol
    if (updateData.role && currentUser.role !== 'admin') {
      delete updateData.role;
    }

    // Actualizar usuario
    await user.update(updateData);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return NextResponse.json(
      {
        message: 'Usuario actualizado exitosamente',
        user: userWithoutPassword,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    
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

// DELETE - Eliminar usuario (solo admins)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar que sea admin
    const authError = await adminMiddleware(request);
    if (authError) return authError;

    await connectDB();

    const { id } = await context.params;
    const userId = parseInt(id);
    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // No permitir eliminar el último admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin', isActive: true } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede eliminar el último administrador' },
          { status: 400 }
        );
      }
    }

    // Soft delete - marcar como inactivo en lugar de eliminar
    await user.update({ isActive: false });

    return NextResponse.json(
      { message: 'Usuario eliminado exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
