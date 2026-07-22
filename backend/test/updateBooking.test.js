jest.mock('../model/bookingModel', () => ({
  getVehicleForBooking: jest.fn(),
  checkConflict: jest.fn(),
  createBooking: jest.fn(),
  getBookingsByCustomer: jest.fn(),
  getBookingById: jest.fn(),
  getBookingOwnerAndCustomer: jest.fn(),
  updateBookingStatus: jest.fn(),
}));

jest.mock('../model/notificationModel', () => ({
  createNotification: jest.fn(),
}));

jest.mock('../service/pdfService', () => ({
  generateAgreementPDF: jest.fn(),
}));

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../server');
const {
  
  getBookingOwnerAndCustomer,
  updateBookingStatus,
} = require('../model/bookingModel');

describe('PATCH /api/bookings/:id/status', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 200 and update status successfully', async () => {
    getBookingOwnerAndCustomer.mockResolvedValue({
      id: 1, owner_id: 1, customer_id: 5, status: 'pending',
    });
    updateBookingStatus.mockResolvedValue({
      id: 1, status: 'confirmed',
    });

    const res = await request(app).patch('/api/bookings/1/status').send({ status: 'confirmed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Status updated');
  });

  test('should return 400 if status field is missing', async () => {
    const res = await request(app).patch('/api/bookings/1/status').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Status is required');
  });

  test('should return 404 if booking does not exist', async () => {
    getBookingOwnerAndCustomer.mockResolvedValue(null);

    const res = await request(app).patch('/api/bookings/999/status').send({ status: 'confirmed' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Booking not found');
  });

  test('should return 403 if user is not owner or customer', async () => {
    getBookingOwnerAndCustomer.mockResolvedValue({
      id: 1, owner_id: 99, customer_id: 88, status: 'pending',
    });

    const res = await request(app).patch('/api/bookings/1/status').send({ status: 'confirmed' });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Not authorised');
  });

  test('should return 400 if status transition is not allowed', async () => {
    getBookingOwnerAndCustomer.mockResolvedValue({
      id: 1, owner_id: 1, customer_id: 5, status: 'completed',
    });

    const res = await request(app).patch('/api/bookings/1/status').send({ status: 'confirmed' });
    expect(res.statusCode).toBe(400);
  });

  test('should call updateBookingStatus with correct id', async () => {
    getBookingOwnerAndCustomer.mockResolvedValue({
      id: 3, owner_id: 1, customer_id: 5, status: 'pending',
    });
    updateBookingStatus.mockResolvedValue({ id: 3, status: 'confirmed' });

    await request(app).patch('/api/bookings/3/status').send({ status: 'confirmed' });
    expect(updateBookingStatus).toHaveBeenCalledTimes(1);
    expect(updateBookingStatus).toHaveBeenCalledWith('3', 'confirmed');
  });

  test('should return 500 if database fails', async () => {
    getBookingOwnerAndCustomer.mockRejectedValue(new Error('DB error'));

    const res = await request(app).patch('/api/bookings/1/status').send({ status: 'confirmed' });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});