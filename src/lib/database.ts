import { Sequelize } from 'sequelize';

// Configuración de la base de datos PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'auth_crud_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
  }
);

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    console.log('🔄 Intentando conectar a la base de datos...');
    console.log('📊 Variables de entorno:', {
      DB_NAME: process.env.DB_NAME,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      // No mostrar la contraseña por seguridad
    });
    
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos.');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    console.error('💡 Verifica que PostgreSQL esté ejecutándose y las credenciales sean correctas.');
    throw error;
    throw error;
  }
};

export default sequelize;
