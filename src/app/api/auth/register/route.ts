import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  // Headers para CORS y contenido
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log('📥 Iniciando proceso de registro...');
    
    // Parsear el body de la request
    let body;
    try {
      body = await request.json();
      console.log('📄 Body recibido:', { ...body, password: '[HIDDEN]' });
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      return NextResponse.json(
        { error: 'Datos JSON inválidos' },
        { status: 400, headers }
      );
    }

    const { email, password, firstName, lastName } = body;

    // Validaciones básicas
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ Faltan campos requeridos');
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400, headers }
      );
    }

    if (password.length < 6) {
      console.log('❌ Contraseña muy corta');
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400, headers }
      );
    }

    // Conectar a la base de datos
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Conexión establecida');

    // Verificar si el usuario ya existe
    console.log('🔍 Verificando si el usuario existe...');
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ Usuario ya existe');
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409, headers }
      );
    }

    // Crear nuevo usuario
    console.log('👤 Creando nuevo usuario...');
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'user', // Rol por defecto
    });
    console.log('✅ Usuario creado con ID:', user.id);

    // Generar token JWT
    console.log('🔑 Generando token JWT...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Retornar respuesta exitosa (sin contraseña)
    const { password: _, ...userWithoutPassword } = user.toJSON();

    console.log('✅ Registro exitoso');
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
        token,
      },
      { status: 201, headers }
    );

  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    console.error('📊 Stack trace:', error.stack);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      
      return NextResponse.json(
        { error: 'Errores de validación', details: validationErrors },
        { status: 400, headers }
      );
    }

    // Manejar errores de conexión a la base de datos
    if (error.name === 'SequelizeConnectionError' || error.message?.includes('connect')) {
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 503, headers }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500, headers }
    );
  }
}
