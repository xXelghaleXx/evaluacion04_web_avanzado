const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor de desarrollo...');
console.log('📁 Directorio de trabajo:', process.cwd());

const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

nextProcess.on('error', (error) => {
  console.error('❌ Error al iniciar el proceso:', error);
});

nextProcess.on('close', (code) => {
  console.log(`🔚 Proceso terminado con código: ${code}`);
});

// Capturar Ctrl+C para cerrar limpiamente
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});
