// Cargar variables de entorno desde .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno de forma explícita
const envPath = resolve(process.cwd(), '.env.local');
const result = config({ path: envPath });

if (result.error) {
  console.error('Error cargando .env.local:', result.error);
} else {
  console.log('✅ Variables de entorno cargadas desde:', envPath);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
}

import { connectDB } from '@/lib/database';
import User from '@/models/User';
import Product from '@/models/Product';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando población de la base de datos...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Crear usuario administrador
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'System',
        role: 'admin',
      },
    });
    
    // Crear usuario normal
    const normalUser = await User.findOrCreate({
      where: { email: 'user@test.com' },
      defaults: {
        email: 'user@test.com',
        password: 'user123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'user',
      },
    });

    console.log('✅ Usuarios creados/verificados');

    // Crear productos de ejemplo
    const sampleProducts = [
      {
        name: 'Laptop Dell XPS 13',
        description: 'Laptop ultrabook de alta gama con procesador Intel Core i7, 16GB RAM y SSD de 512GB. Perfecta para trabajo y desarrollo.',
        price: 1299.99,
        stock: 15,
        category: 'Electrónicos',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        userId: adminUser[0].id,
      },
      {
        name: 'Smartphone Samsung Galaxy S23',
        description: 'Teléfono inteligente de última generación con cámara de 108MP, 256GB de almacenamiento y pantalla AMOLED.',
        price: 899.99,
        stock: 25,
        category: 'Electrónicos',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        userId: normalUser[0].id,
      },
      {
        name: 'Auriculares Sony WH-1000XM4',
        description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria. Hasta 30 horas de batería.',
        price: 349.99,
        stock: 30,
        category: 'Audio',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        userId: adminUser[0].id,
      },
      {
        name: 'Teclado Mecánico RGB',
        description: 'Teclado mecánico para gaming con switches Cherry MX, iluminación RGB personalizable y construcción premium.',
        price: 159.99,
        stock: 20,
        category: 'Accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
        userId: normalUser[0].id,
      },
      {
        name: 'Monitor 4K 27 pulgadas',
        description: 'Monitor profesional 4K UHD con panel IPS, 99% sRGB y conectividad USB-C. Ideal para diseño y productividad.',
        price: 599.99,
        stock: 12,
        category: 'Electrónicos',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        userId: adminUser[0].id,
      },
      {
        name: 'Cámara DSLR Canon EOS R5',
        description: 'Cámara profesional mirrorless de 45MP con grabación de video 8K y estabilización de imagen en el cuerpo.',
        price: 3899.99,
        stock: 5,
        category: 'Fotografía',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        userId: normalUser[0].id,
      },
      {
        name: 'Mesa de Escritorio Ajustable',
        description: 'Mesa de escritorio de altura ajustable eléctricamente. Marco de acero robusto y superficie de madera de roble.',
        price: 699.99,
        stock: 8,
        category: 'Muebles',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        userId: adminUser[0].id,
      },
      {
        name: 'Silla Ergonómica Herman Miller',
        description: 'Silla de oficina ergonómica de alta gama con soporte lumbar ajustable y materiales premium.',
        price: 1299.99,
        stock: 6,
        category: 'Muebles',
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500',
        userId: normalUser[0].id,
      },
    ];

    for (const productData of sampleProducts) {
      await Product.findOrCreate({
        where: { 
          name: productData.name,
          userId: productData.userId,
        },
        defaults: productData,
      });
    }

    console.log('✅ Productos de ejemplo creados/verificados');
    console.log('🎉 Base de datos poblada exitosamente!');
    
    console.log('\n📋 Credenciales de prueba:');
    console.log('👨‍💼 Admin: admin@test.com / admin123');
    console.log('👤 Usuario: user@test.com / user123');
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedDatabase;
