const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Conectar a MongoDB en memoria o a una DB de test
beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/todo-test'
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth - Registro', () => {
  it('debe registrar un nuevo usuario correctamente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('debe rechazar registro con email duplicado', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
  });

  it('debe rechazar registro con email inválido', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'no-es-un-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe rechazar registro con password corta', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('Auth - Login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('debe hacer login correctamente', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('debe rechazar login con password incorrecta', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
  });

  it('debe rechazar login con email no registrado', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'noexiste@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
  });
});
