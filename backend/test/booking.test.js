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
  createNotification: jest.fn().mockResolvedValue({}),
}));

jest.mock('../service/pdfService', () => ({
  generateAgreementPDF: jest.fn(),
}));

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'customer' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../server');
const {
  getVehicleForBooking,
  checkConflict,
  createBooking,
  getBookingsByCustomer,
  getBookingById,
  getBookingOwnerAndCustomer,
  updateBookingStatus,
} = require('../model/bookingModel');

describe('POST /api/bookings', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 201 and create booking successfully', async () => {
    getVehicleForBooking.mockResolvedValue({
      id: 2, owner_id: 99, is_active: true,
      daily_rate: 2000, driver_rate: 0,
      has_driver: false, driver_only: false,
    });
    checkConflict.mockResolvedValue(null);
    createBooking.mockResolvedValue({
      id: 10, reference_code: 'DN-ABCDEF', total_amount: 4200,
    });

    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 2,
      start_date: '2027-01-01',
      end_date: '2027-01-02',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Booking created successfully');
  });

  test('should return 400 if vehicle_id is missing', async () => {
    const res = await request(app).post('/api/bookings').send({
      start_date: '2027-01-01',
      end_date: '2027-01-02',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Vehicle, start date and end date are required');
  });

  test('should return 400 if start_date is missing', async () => {
    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 2,
      end_date: '2027-01-02',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Vehicle, start date and end date are required');
  });

  test('should return 400 if end date is before start date', async () => {
    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 2,
      start_date: '2027-01-05',
      end_date: '2027-01-01',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('End date must be after start date');
  });

  test('should return 404 if vehicle is not available', async () => {
    getVehicleForBooking.mockResolvedValue(null);

    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 999,
      start_date: '2027-01-01',
      end_date: '2027-01-02',
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Vehicle not available');
  });

  test('should return 409 if dates conflict with existing booking', async () => {
    getVehicleForBooking.mockResolvedValue({
      id: 2, owner_id: 99, is_active: true,
      daily_rate: 2000, driver_rate: 0,
      has_driver: false, driver_only: false,
    });
    checkConflict.mockResolvedValue({ id: 5 });

    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 2,
      start_date: '2027-01-01',
      end_date: '2027-01-02',
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('This vehicle is already booked for the selected dates');
  });

  test('should return 500 if database fails', async () => {
    getVehicleForBooking.mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/bookings').send({
      vehicle_id: 2,
      start_date: '2027-01-01',
      end_date: '2027-01-02',
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error creating booking');
  });
});

describe('GET /api/bookings/my', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('should return 200 and list of bookings', async () => {
    getBookingsByCustomer.mockResolvedValue([
      { id: 1, reference_code: 'DN-AAA111' },
      { id: 2, reference_code: 'DN-BBB222' },
    ]);

    const res = await request(app).get('/api/bookings/my');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
  });

  test('should return 200 with empty array if no bookings', async () => {
    getBookingsByCustomer.mockResolvedValue([]);

    const res = await request(app).get('/api/bookings/my');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
  });

  test('should return 500 if database fails', async () => {
    getBookingsByCustomer.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/bookings/my');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});