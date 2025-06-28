import { NextResponse, NextRequest } from 'next/server';

// Simulamos una base de datos en memoria
let products = [
  { id: 1, name: 'Producto Demo 1', description: 'Descripción demo', price: 100, stock: 50, isActive: true },
  { id: 2, name: 'Producto Demo 2', description: 'Descripción demo 2', price: 200, stock: 30, isActive: true }
];

let nextId = 3;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products: products
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Creando nuevo producto...');
    
    const body = await request.json();
    console.log('📄 Datos recibidos:', body);

    const { name, description, price, stock } = body;

    // Validaciones
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'El nombre del producto es requerido' 
      }, { status: 400 });
    }

    if (!price || price <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'El precio debe ser mayor a 0' 
      }, { status: 400 });
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'El stock debe ser 0 o mayor' 
      }, { status: 400 });
    }

    // Crear nuevo producto
    const newProduct = {
      id: nextId++,
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);

    console.log('✅ Producto creado:', newProduct);

    return NextResponse.json({
      success: true,
      message: 'Producto creado exitosamente',
      product: newProduct
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error al crear producto:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}
