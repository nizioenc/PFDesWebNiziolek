# Backend API - Arquitectura de 3 Capas

## 🏗️ Arquitectura

Este backend sigue una **arquitectura de 3 capas distribuida**:

1. **Capa de Presentación**: API REST (Express.js)
2. **Capa de Lógica de Negocio**: Servicios especializados
3. **Capa de Datos**: MongoDB con Mongoose

## 📁 Estructura del Proyecto

```
backend/
├── config/           # Configuración de la aplicación
├── controllers/      # Controladores HTTP
├── middleware/       # Middlewares
├── models/          # Modelos de datos
├── routes/          # Rutas de la API
├── services/        # Lógica de negocio
├── utils/           # Utilidades
└── server.js        # Punto de entrada
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del backend:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=tu_secret_super_seguro_para_desarrollo
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar MongoDB
- Instalar MongoDB localmente, o
- Usar MongoDB Atlas (nube)

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```
- Servidor en: http://localhost:5000
- Hot reload activado
- Logs detallados

### Producción
```bash
npm start
```
- Servidor optimizado
- Sin hot reload
- Logs limitados

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (protegido)
- `PUT /api/auth/me` - Actualizar perfil (protegido)

### Tareas
- `GET /api/tasks` - Obtener tareas (protegido)
- `POST /api/tasks` - Crear tarea (protegido)
- `PUT /api/tasks/:id` - Actualizar tarea (protegido)
- `PATCH /api/tasks/:id/toggle` - Toggle completado (protegido)
- `DELETE /api/tasks/:id` - Eliminar tarea (protegido)

### Listas
- `GET /api/lists` - Obtener listas del usuario (protegido)
- `GET /api/lists/public` - Obtener listas públicas
- `GET /api/lists/public/:id` - Obtener lista pública específica
- `GET /api/lists/:id` - Obtener lista del usuario (protegido)
- `POST /api/lists` - Crear lista (protegido)
- `PUT /api/lists/:id` - Actualizar lista (protegido)
- `PUT /api/lists/:id/toggle-public` - Toggle visibilidad (protegido)
- `DELETE /api/lists/:id` - Eliminar lista (protegido)

### Calificaciones
- `GET /api/ratings/list/:listId` - Obtener calificaciones de lista
- `GET /api/ratings/list/:listId/average` - Obtener promedio de calificaciones
- `POST /api/ratings/list/:listId` - Calificar lista (protegido)
- `PUT /api/ratings/:id` - Actualizar calificación (protegido)
- `DELETE /api/ratings/:id` - Eliminar calificación (protegido)

## 🔧 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm test` - Ejecutar tests (pendiente)

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing

## 📝 Notas de Desarrollo

- Todas las rutas protegidas requieren token JWT en el header `Authorization: Bearer <token>`
- Los errores se manejan de forma estandarizada
- Las validaciones están centralizadas en `utils/validators.js`
- Las respuestas siguen un formato consistente 