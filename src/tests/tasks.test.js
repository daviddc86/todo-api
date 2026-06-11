const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/todo-tasks-test'
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  // Crear usuario y obtener token para cada test
  const res = await request(app).post('/api/auth/register').send({
    name: 'Task User',
    email: 'tasks@example.com',
    password: 'password123',
  });

  token = res.body.token;
  userId = res.body.user.id;
});

describe('Tasks - Crear', () => {
  it('debe crear una tarea correctamente', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Mi primera tarea',
        description: 'Descripción de prueba',
        responsible: 'Ana González',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.task.title).toBe('Mi primera tarea');
    expect(res.body.task.completed).toBe(false);
  });

  it('debe rechazar creación sin título', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ responsible: 'Ana González' });

    expect(res.statusCode).toBe(400);
  });

  it('debe rechazar creación sin token', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Tarea sin auth',
      responsible: 'Alguien',
    });

    expect(res.statusCode).toBe(401);
  });
});

describe('Tasks - Listar', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 1', responsible: 'Usuario 1' });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 2', responsible: 'Usuario 2' });
  });

  it('debe listar las tareas del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.tasks).toHaveLength(2);
  });
});

describe('Tasks - Completar', () => {
  it('debe marcar una tarea como completada', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea a completar', responsible: 'Luis' });

    const taskId = createRes.body.task._id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.task.completed).toBe(true);
  });
});

describe('Tasks - Eliminar', () => {
  it('debe eliminar una tarea correctamente', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea a borrar', responsible: 'Carlos' });

    const taskId = createRes.body.task._id;

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('no debe poder eliminar una tarea de otro usuario', async () => {
    // Crear segundo usuario
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Otro User',
      email: 'otro@example.com',
      password: 'password123',
    });
    const token2 = res2.body.token;

    // Crear tarea con usuario 1
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea privada', responsible: 'Usuario 1' });

    const taskId = createRes.body.task._id;

    // Intentar borrar con usuario 2
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(deleteRes.statusCode).toBe(403);
  });
});
