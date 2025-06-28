# Auth CRUD App - Despliegue en Vercel

## 🚀 Despliegue Automático

### Opción 1: Despliegue directo desde repositorio

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/auth-crud-app.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente que es Next.js

### Opción 2: Despliegue con Vercel CLI

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión:**
   ```bash
   vercel login
   ```

3. **Despliega:**
   ```bash
   vercel --prod
   ```

## 🔧 Variables de Entorno en Vercel

En el dashboard de Vercel, configura estas variables:

### Variables Requeridas:
```
NODE_ENV=production
JWT_SECRET=tu-secreto-jwt-super-seguro
NEXTAUTH_SECRET=tu-secreto-nextauth
NEXTAUTH_URL=https://tu-app.vercel.app
```

### Base de Datos (opciones):

#### Opción A: Vercel Postgres
```
# Vercel creará automáticamente estas variables
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

#### Opción B: Neon Database (Recomendado)
```
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/dbname?sslmode=require
```

#### Opción C: Supabase
```
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

## 🗄️ Base de Datos en Producción

### Usando Neon (Recomendado - Gratis):

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la connection string
5. Agrégala como `DATABASE_URL` en Vercel

### Usando Vercel Postgres:

1. En tu proyecto de Vercel, ve a Storage
2. Haz clic en "Create Database"
3. Selecciona "Postgres"
4. Las variables se configurarán automáticamente

## 📝 Pasos de Despliegue Completo

1. **Prepara el código:**
   ```bash
   npm run build  # Verifica que compile sin errores
   ```

2. **Configura variables de entorno en Vercel**

3. **Despliega:**
   ```bash
   vercel --prod
   ```

4. **Configura la base de datos:**
   - Ejecuta el seeder en producción (opcional)
   - O migra datos existentes

## 🔍 Verificación Post-Despliegue

- ✅ La app carga correctamente
- ✅ Las APIs funcionan
- ✅ El login/registro funciona
- ✅ El CRUD de productos funciona
- ✅ Las variables de entorno están configuradas

## 🐛 Solución de Problemas

### Error de build:
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Vercel

### Error de base de datos:
- Verifica la connection string
- Asegúrate de que la DB esté accesible desde internet

### Error 500:
- Revisa los logs de función en Vercel
- Verifica las variables de entorno
