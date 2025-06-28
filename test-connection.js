const { Client } = require('pg');

async function testConnection(password) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'auth_crud_db',
    user: 'postgres',
    password: password,
  });

  try {
    await client.connect();
    console.log(`✅ Conexión exitosa con contraseña: ${password}`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ Falló con contraseña: ${password}`);
    return false;
  }
}

async function testPasswords() {
  const passwords = ['1234', 'postgres', 'admin', 'password', '', 'root', '123456'];
  
  console.log('🔍 Probando diferentes contraseñas...\n');
  
  for (const password of passwords) {
    const success = await testConnection(password);
    if (success) {
      console.log(`\n🎉 ¡Contraseña correcta encontrada: "${password}"`);
      console.log('\n📝 Actualiza tu archivo .env.local con esta contraseña');
      return;
    }
  }
  
  console.log('\n❌ No se encontró ninguna contraseña válida');
  console.log('💡 Revisa la configuración de PostgreSQL o cambia la contraseña');
}

testPasswords();
