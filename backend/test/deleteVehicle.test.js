jest.mock('../model/vehicleModel', () => ({
  getVehicleOwner: jest.fn(),
  softDeleteVehicle: jest.fn(),
  searchVehicles: jest.fn(),
  getVehicleById: jest.fn(),
  getBookedDates: jest.fn(),
  addPhoto: jest.fn(),
  createVehicle: jest.fn(),
  getVehiclesByOwner: jest.fn(),
}));

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
}));

jest.mock('../middleware/uploadMiddleware', () => ({
  uploadVehiclePhotos: {
    array: () => (req, res, next) => {
      req.files = [];
      next();
    },
  },
}));

const request = require('supertest');
const app = require('../server');
const { getVehicleOwner, softDeleteVehicle } = require('../model/vehicleModel');

describe('DELETE /api/vehicles/:id', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 200 and delete vehicle successfully', async () => {
    getVehicleOwner.mockResolvedValue({ owner_id: 1 });
    softDeleteVehicle.mockResolvedValue();

    const res = await request(app).delete('/api/vehicles/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Vehicle removed');
  });

  test('should call softDeleteVehicle with correct id', async () => {
    getVehicleOwner.mockResolvedValue({ owner_id: 1 });
    softDeleteVehicle.mockResolvedValue();

    await request(app).delete('/api/vehicles/5');
    expect(softDeleteVehicle).toHaveBeenCalledTimes(1);
    expect(softDeleteVehicle).toHaveBeenCalledWith('5');
  });

  test('should return 404 if vehicle does not exist', async () => {
    getVehicleOwner.mockResolvedValue(null);

    const res = await request(app).delete('/api/vehicles/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Vehicle not found');
  });

  test('should return 403 if user does not own the vehicle', async () => {
    getVehicleOwner.mockResolvedValue({ owner_id: 99 });

    const res = await request(app).delete('/api/vehicles/1');
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Not your vehicle');
  });

  test('should call softDeleteVehicle only once per request', async () => {
    getVehicleOwner.mockResolvedValue({ owner_id: 1 });
    softDeleteVehicle.mockResolvedValue();

    await request(app).delete('/api/vehicles/1');
    expect(softDeleteVehicle).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if database fails', async () => {
    getVehicleOwner.mockRejectedValue(new Error('DB error'));

    const res = await request(app).delete('/api/vehicles/1');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});