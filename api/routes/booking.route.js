const express = require('express');
const { saveBooking, getBookingsByUser, deleteBooking } = require('../controllers/booking.controller');

const router = express.Router();

router.post('/', saveBooking);
router.get('/', getBookingsByUser);
router.delete('/:id', deleteBooking);

module.exports = router;