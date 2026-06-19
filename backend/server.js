require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const pool    = require('./database/db');

const userRoute = require('./route/userRoute');
const vehicleRoute = require('./route/vehicleRoute');
const bookingRoute = require('./route/bookingRoute');
const passport = require('./middleware/passport');

const app  = express();
const PORT = process.env.PORT || 8000;

const reviewRoute = require('./route/reviewRoute');
const messageRoute = require('./route/messageRoute');
const notificationRoute = require('./route/notificationRoute');
const adminRoute = require('./route/adminRoute');
const disputeRoute = require('./route/disputeRoute');

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.get('/test', (req, res) => {
  res.json({ message: 'DriveNepal backend is running' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS time');
    res.json({ connected: true, time: result.rows[0].time });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

app.use('/api', userRoute);
app.use('/api/vehicles', vehicleRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/messages', messageRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/admin', adminRoute);
app.use('/api/disputes', disputeRoute);

const seedAdmin = async () => {
  const bcrypt = require('bcryptjs');
  const db = require('./database/db');
  const email = 'admin@drivenepal.com';
  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!existing.rows[0]) {
      const hash = await bcrypt.hash('Admin@12345', 10);
      await db.query(
        `INSERT INTO users (full_name, email, password_hash, role, is_verified)
         VALUES ('DriveNepal Admin', $1, $2, 'admin', true)`,
        [email, hash]
      );
      console.log('Admin account created: admin@drivenepal.com / Admin@12345');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
seedAdmin();

app.listen(PORT, () => {
  console.log(`DriveNepal server running on port ${PORT}`);
});

