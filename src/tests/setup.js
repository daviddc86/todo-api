// Configuración de entorno para los tests.
// app.js no carga dotenv (eso solo lo hace server.js), por lo que aquí
// garantizamos las variables que la app necesita durante los tests.
//
// Importante: NO cargamos MONGO_URI desde .env. Los tests usan sus propias
// bases de datos (todo-test / todo-tasks-test) y ejecutan dropDatabase() al
// finalizar; usar la URI de desarrollo borraría datos reales.

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
