const express = require('express');
const router  = express.Router();

const {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  getAvailability,

} = require('../controller/vehicleController');

const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', getVehicles);

router.get('/owner/my', protect, requireRole('owner'), getMyVehicles);

router.post('/', protect, requireRole('owner'), createVehicle);

router.get('/:id/availability', getAvailability);


router.get('/:id', getVehicleById);

module.exports = router;  