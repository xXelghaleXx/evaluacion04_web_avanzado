# AuthCRUD App - Sistema de Autenticación y CRUD Completo

## 🚀 Descripción

Aplicación web moderna construida con **Next.js**, **TypeScript**, **JWT**, **Sequelize** y **PostgreSQL**. Sistema completo de autenticación y gestión de datos con interfaz moderna y responsive.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Base de Datos**: PostgreSQL con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcryptjs
- **Validación**: Validaciones nativas de Sequelize
- **UI/UX**: Tailwind CSS, componentes responsive

## ✨ Características

### 🔐 Sistema de Autenticación
- Registro e inicio de sesión seguro
- Encriptación de contraseñas con bcrypt
- Tokens JWT con expiración
- Protección de rutas del lado del servidor y cliente
- Roles de usuario (admin/user)

### 📊 CRUD Completo
- **Usuarios**: Gestión completa (solo admins)
- **Productos**: CRUD con validaciones y filtros
- Soft delete (marcado como inactivo)
- Paginación y búsqueda

### 🎨 Interfaz Moderna
- Diseño responsive con Tailwind CSS
- Dashboard dinámico con estadísticas
- Navegación intuitiva
- Feedback visual para todas las acciones

### 🔒 Seguridad
- Middleware de autenticación
- Validación de datos en frontend y backend
- Protección contra inyecciones SQL (Sequelize)
- Manejo seguro de tokens

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **PostgreSQL** (versión 12 o superior)
3. **npm** o **yarn**

## � Instalación y Configuración

### 1. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose en tu computadora.

#### En Windows:
- Descarga PostgreSQL desde: https://www.postgresql.org/download/
- Durante la instalación, configura:
  - Usuario: `postgres`
  - Contraseña: `password` (o la que prefieras)
  - Puerto: `5432`

#### Crear la base de datos:
```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear la base de datos
CREATE DATABASE auth_crud_db;

-- Crear un usuario específico (opcional)
CREATE USER auth_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE auth_crud_db TO auth_user;

-- Salir
\q
```

### 2. Configurar Variables de Entorno

Edita el archivo `.env.local` y ajusta las credenciales de tu PostgreSQL:

```env
# Database Configuration - PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_crud_db"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_crud_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aquí

# JWT Configuration
JWT_SECRET=tu-super-secreto-jwt-cambiar-en-produccion
NEXTAUTH_SECRET=tu-nextauth-secret-aqui
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NODE_ENV=development
```

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Database Configuration
DATABASE_URL="mysql://root:password@localhost:3306/auth_crud_db"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=auth_crud_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

# JWT Configuration
JWT_SECRET=tu-super-secreto-jwt-aqui-cambiar-en-produccion
NEXTAUTH_SECRET=tu-nextauth-secret-aqui
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NODE_ENV=development
```

### 3. Configurar Base de Datos MySQL

#### Opción A: MySQL Local
```sql
-- Conectarse a MySQL como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE auth_crud_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON auth_crud_db.* TO 'auth_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Poblar la base de datos con datos de prueba
```bash
npm run db:seed
```

### 5. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 👥 Credenciales de Prueba

### Administrador
- **Email**: admin@test.com
- **Contraseña**: admin123

### Usuario Normal
- **Email**: user@test.com  
- **Contraseña**: user123
