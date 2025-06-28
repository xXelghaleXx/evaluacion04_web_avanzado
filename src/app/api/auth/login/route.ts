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
    console.log('📥 Iniciando proceso de login...');
    
    // Parsear el body de la request
    let body;
    try {
      body = await request.json();
      console.log('📄 Body recibido:', { email: body.email, password: '[HIDDEN]' });
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      return NextResponse.json(
        { error: 'Datos JSON inválidos' },
        { status: 400, headers }
      );
    }

    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      console.log('❌ Faltan credenciales');
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400, headers }
      );
    }

    // Conectar a la base de datos
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Conexión establecida');

    // Buscar usuario por email
    console.log('🔍 Buscando usuario por email...');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401, headers }
      );
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log('❌ Usuario inactivo');
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacte al administrador.' },
        { status: 401, headers }
      );
    }

    // Verificar contraseña
    console.log('🔐 Verificando contraseña...');
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('❌ Contraseña inválida');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401, headers }
      );
    }

    // Generar token JWT
    console.log('🔑 Generando token JWT...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Retornar respuesta exitosa (sin contraseña)
    const userWithoutPassword = user.toJSON();
    delete (userWithoutPassword as any).password;

    console.log('✅ Login exitoso para usuario:', user.id);
    return NextResponse.json(
      {
        message: 'Login exitoso',
        user: userWithoutPassword,
        token,
      },
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('❌ Error en login:', error);
    console.error('📊 Stack trace:', error.stack);
    
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
