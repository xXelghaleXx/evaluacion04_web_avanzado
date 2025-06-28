// Test database connection
require('dotenv').config({ path: '.env.local' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'auth_crud_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection();
