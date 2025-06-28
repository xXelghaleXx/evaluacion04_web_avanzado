// Test API registration endpoint
require('dotenv').config({ path: '.env.local' });

const testRegistration = async () => {
  try {
    console.log('🧪 Probando endpoint de registro...');
    
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📊 Response Text:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('✅ Response JSON:', responseJson);
    } catch (e) {
      console.log('❌ No se pudo parsear como JSON');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

testRegistration();
