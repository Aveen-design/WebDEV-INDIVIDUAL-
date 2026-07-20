jest.mock('../model/userModel', () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('bcryptjs');

const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../model/userModel');

describe('POST /api/auth/register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 201 and create account successfully', async () => {
    findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
    createUser.mockResolvedValue({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
    });

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Account created successfully');
  });

  test('should return 400 if full_name is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Full name, email and password are required');
  });

  test('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Full name, email and password are required');
  });

  test('should return 400 if password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@example.com',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Full name, email and password are required');
  });

  test('should return 400 if email format is invalid', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'notanemail',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please provide a valid email address');
  });

  test('should return 400 if password is less than 8 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'abc',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password must be at least 8 characters');
  });

  test('should return 409 if email already exists', async () => {
    findUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('An account with this email already exists');
  });

  test('should return 500 if database fails', async () => {
    findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
    createUser.mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error during registration');
  });
});