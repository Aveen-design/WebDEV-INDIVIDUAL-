const express = require('express');
const router  = express.Router();

const {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  getAvailability,
  deleteVehicle

} = require('../controller/vehicleController');

const { protect, requireRole } = require('../middleware/authMiddleware');
const { uploadVehiclePhotos } = require('../middleware/uploadMiddleware');
router.get('/', getVehicles);

router.get('/owner/my', protect, requireRole('owner'), getMyVehicles);

router.post('/', protect, requireRole('owner'), uploadVehiclePhotos.array('photos', 6), createVehicle);
router.delete('/:id', protect, deleteVehicle);

router.get('/:id/availability', getAvailability);


router.get('/:id', getVehicleById);

module.exports = router;  