require('dotenv').config({ path: '.env.local' });
const { Sequelize } = require('sequelize');

async function testSequelizeConnection() {
  console.log('Variables de entorno cargadas:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  try {
    // Probamos con configuración individual
    console.log('\n🔗 Probando conexión con configuración individual...');
    const sequelize1 = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: 'postgres',
        logging: console.log,
      }
    );

    await sequelize1.authenticate();
    console.log('✅ Conexión individual exitosa');
    await sequelize1.close();

    // Probamos con DATABASE_URL
    console.log('\n🔗 Probando conexión con DATABASE_URL...');
    const sequelize2 = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log,
    });

    await sequelize2.authenticate();
    console.log('✅ Conexión con DATABASE_URL exitosa');
    await sequelize2.close();

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Error completo:', error);
  }
}

testSequelizeConnection();
