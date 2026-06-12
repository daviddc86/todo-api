# todo-api-nodejs

API REST para gestión de tareas con autenticación JWT.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (bcryptjs)
- Swagger OpenAPI
- Jest + Supertest

## Instalación

```bash
git clone https://github.com/tu-usuario/todo-api-nodejs.git
cd todo-api
npm install
cp .env.example .env
# Edita .env con tus valores
```

## Variables de entorno

```env
MONGO_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=tu_clave_secreta
PORT=5000
NODE_ENV=development
```

## Ejecución local

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Tests

```bash
# Ejecutar todos los tests
npm test

# Con cobertura
npm run test:coverage
```

> Los tests crean su propia base de datos. Asegúrate de tener MongoDB corriendo en localhost.

## Swagger

Con el servidor corriendo, accede a:

```
http://localhost:5000/api-docs
```

Desde Swagger puedes probar todos los endpoints. Para las rutas protegidas, haz primero login, copia el token y pégalo en el botón **Authorize** usando el formato: `Bearer <token>`.

## Docker

```bash
# Levantar API + MongoDB con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar
docker-compose down
```

## Endpoints

### Auth

| Método | Ruta                 | Descripción               |
|--------|----------------------|---------------------------|
| POST   | /api/auth/register   | Registrar usuario         |
| POST   | /api/auth/login      | Login (devuelve JWT)      |

### Tasks (requieren JWT)

| Método | Ruta                      | Descripción               |
|--------|---------------------------|---------------------------|
| POST   | /api/tasks                | Crear tarea               |
| GET    | /api/tasks                | Listar tareas del usuario |
| GET    | /api/tasks/:id            | Obtener tarea por ID      |
| PUT    | /api/tasks/:id            | Actualizar tarea          |
| PATCH  | /api/tasks/:id/complete   | Marcar como completada    |
| DELETE | /api/tasks/:id            | Eliminar tarea            |

## Despliegue

### Render

1. Crea cuenta en [render.com](https://render.com)
2. New → Web Service → conecta tu repositorio GitHub
3. **Build Command**: `npm install`
4. **Start Command**: `node src/server.js`
5. Añade las variables de entorno en el panel de Render:
   - `MONGO_URI` (usa MongoDB Atlas)
   - `JWT_SECRET`
   - `NODE_ENV=production`


### MongoDB Atlas (base de datos en producción)

1. Crea cuenta en [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea un Cluster gratuito (M0)
3. Crea un usuario de base de datos
4. Añade tu IP (o 0.0.0.0/0 para permitir todas)
5. Copia la Connection String y úsala como `MONGO_URI`

## Subir a GitHub

```bash
git init
git add .
git commit -m "feat: initial commit - todo api nodejs"
git branch -M main
git remote add origin https://github.com/tu-usuario/todo-api-nodejs.git
git push -u origin main
```
