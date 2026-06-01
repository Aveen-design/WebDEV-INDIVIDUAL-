require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const pool    = require('./database/db');

const userRoute = require('./route/userRoute');
const vehicleRoute = require('./route/vehicleRoute');

const app  = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`DriveNepal server running on port ${PORT}`);
});