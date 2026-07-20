jest.mock('../model/userModel', () => ({
  findUserByEmail: jest.fn(),
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../model/userModel');

describe('POST /api/auth/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 and token on successful login', async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashed_password',
      role: 'customer',
      is_active: true,
      is_verified: true,
      phone: null,
      avatar_url: null,
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fakeToken123');

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.token).toBe('fakeToken123');
  });

  test('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  test('should return 400 if password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  test('should return 401 if user is not found', async () => {
    findUserByEmail.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'noone@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('should return 401 if password is incorrect', async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashed_password',
      is_active: true,
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('should return 403 if account is suspended', async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashed_password',
      is_active: false,
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Your account has been suspended');
  });

  test('should return 500 if database fails', async () => {
    findUserByEmail.mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error during login');
  });

  test('should return 500 if bcrypt compare fails', async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashed_password',
      is_active: true,
    });
    bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(500);
  });

  test('should return 500 if jwt sign fails', async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashed_password',
      is_active: true,
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation(() => { throw new Error('jwt error'); });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(500);
  });
});