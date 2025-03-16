const { registerUser, loginUser, authenticateToken } = require('../src/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const request = require('supertest');
const express = require('express');

const dbPath = path.resolve(__dirname, '../src/scoutingApp.db');
const db = new sqlite3.Database(dbPath);

const app = express();
app.use(express.json());
app.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

describe('User Authentication', () => {
  beforeAll((done) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS users');
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        )
      `, done);
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword', role: 'user' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('role', 'user');
  });

  test('should not register a user with an existing username', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword', role: 'user' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should login a registered user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should access protected route with valid token', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });
    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Protected route accessed');
  });

  test('should not access protected route without token', async () => {
    const response = await request(app)
      .get('/protected');
    expect(response.status).toBe(401);
  });

  test('should not access protected route with invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
  });
});
