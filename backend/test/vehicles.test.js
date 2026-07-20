jest.mock('../model/vehicleModel', () => ({
  searchVehicles: jest.fn(),
  getVehicleById: jest.fn(),
  getVehicleOwner: jest.fn(),
  softDeleteVehicle: jest.fn(),
  getBookedDates: jest.fn(),
}));

const request = require('supertest');
const app = require('../server');
const { searchVehicles, getVehicleById } = require('../model/vehicleModel');

describe('GET /api/vehicles', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 200 and list of vehicles', async () => {
    const mockVehicles = [
      { id: 1, title: 'Toyota Corolla', type: 'car', daily_rate: 2000, total_count: 2 },
      { id: 2, title: 'Honda CB', type: 'motorcycle', daily_rate: 800, total_count: 2 },
    ];
    searchVehicles.mockResolvedValue(mockVehicles);

    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.vehicles).toHaveLength(2);
  });

  test('should return 200 with empty array if no vehicles exist', async () => {
    searchVehicles.mockResolvedValue([]);

    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.vehicles).toHaveLength(0);
  });

  test('should return 500 if database fails', async () => {
    searchVehicles.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error fetching vehicles');
  });
});

describe('GET /api/vehicles/:id', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 200 and vehicle details', async () => {
    const mockVehicle = {
      id: 1,
      title: 'Toyota Corolla',
      type: 'car',
      daily_rate: 2000,
      location: 'Kathmandu',
    };
    getVehicleById.mockResolvedValue(mockVehicle);

    const res = await request(app).get('/api/vehicles/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Toyota Corolla');
  });

  test('should return 404 if vehicle does not exist', async () => {
    getVehicleById.mockResolvedValue(null);

    const res = await request(app).get('/api/vehicles/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Vehicle not found');
  });

  test('should return 500 if database fails', async () => {
    getVehicleById.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/vehicles/1');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error fetching vehicle');
  });
});