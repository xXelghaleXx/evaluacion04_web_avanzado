import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Headers para CORS y contenido
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log('📥 Iniciando proceso de registro simplificado...');
    
    // Parsear el body de la request
    let body;
    try {
      body = await request.json();
      console.log('📄 Body recibido:', { ...body, password: '[HIDDEN]' });
    } catch (parseError: any) {
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

    // Por ahora, devolvemos una respuesta de éxito sin tocar la DB
    console.log('✅ Registro simulado exitoso');
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente (simulado)',
        user: {
          id: 1,
          email,
          firstName,
          lastName,
          role: 'user',
          isActive: true
        },
        token: 'fake-jwt-token-for-testing',
      },
      { status: 201, headers }
    );

  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    console.error('📊 Stack trace:', error.stack);
    
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500, headers }
    );
  }
}
