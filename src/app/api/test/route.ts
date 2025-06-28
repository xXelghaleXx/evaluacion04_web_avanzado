import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 API de prueba - iniciando...');
    
    // Headers básicos
    const headers = {
      'Content-Type': 'application/json',
    };

    // Intentar parsear el JSON
    let body;
    try {
      body = await request.json();
      console.log('✅ JSON parseado correctamente:', body);
    } catch (parseError: any) {
      console.error('❌ Error al parsear JSON:', parseError);
      return NextResponse.json(
        { error: 'JSON inválido', details: parseError.message },
        { status: 400, headers }
      );
    }

    // Respuesta de prueba exitosa
    return NextResponse.json(
      { 
        success: true, 
        message: 'API de prueba funcionando',
        received: body 
      },
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('❌ Error general en API:', error);
    return NextResponse.json(
      { error: 'Error del servidor', details: error.message },
      { status: 500 }
    );
  }
}
