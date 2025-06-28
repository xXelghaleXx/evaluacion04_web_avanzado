import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Product from '@/models/Product';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/middleware/auth';

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const productId = parseInt(id);
    
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
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
    const productId = parseInt(id);
    const updateData = await request.json();

    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Solo el propietario del producto o un admin puede actualizarlo
    if (currentUser.role !== 'admin' && product.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Validaciones si se proporcionan
    if (updateData.price !== undefined && updateData.price <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor a 0' },
        { status: 400 }
      );
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      return NextResponse.json(
        { error: 'El stock no puede ser negativo' },
        { status: 400 }
      );
    }

    // Actualizar producto
    await product.update(updateData);

    // Obtener producto actualizado con información del usuario
    const updatedProduct = await Product.findByPk(productId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    return NextResponse.json(
      {
        message: 'Producto actualizado exitosamente',
        product: updatedProduct,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    
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

// DELETE - Eliminar producto
export async function DELETE(
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
    const productId = parseInt(id);
    const product = await Product.findByPk(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Solo el propietario del producto o un admin puede eliminarlo
    if (currentUser.role !== 'admin' && product.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Soft delete - marcar como inactivo
    await product.update({ isActive: false });

    return NextResponse.json(
      { message: 'Producto eliminado exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
