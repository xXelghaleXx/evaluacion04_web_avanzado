import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Product from '@/models/Product';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/middleware/auth';
import { Op } from 'sequelize';

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Construir filtros
    const where: any = { isActive: true };
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json(
      {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto (usuarios autenticados)
export async function POST(request: NextRequest) {
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

    const { name, description, price, stock, category, imageUrl } = await request.json();

    // Validaciones
    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json(
        { error: 'Los campos name, description, price, stock y category son requeridos' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor a 0' },
        { status: 400 }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: 'El stock no puede ser negativo' },
        { status: 400 }
      );
    }

    // Crear producto
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      userId: currentUser.id,
    });

    // Obtener producto con información del usuario
    const productWithUser = await Product.findByPk(product.id, {
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
        message: 'Producto creado exitosamente',
        product: productWithUser,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error al crear producto:', error);
    
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
