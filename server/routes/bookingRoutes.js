import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  const { car_id, pickup_date, dropoff_date, total_amount, pickup_location, dropoff_location, total_days, payment_method } = req.body;

  if (!car_id || !pickup_date || !dropoff_date || !total_amount) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const car = await Car.findById(car_id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const booking = new Booking({
      user_id: req.user._id,
      car_id,
      pickup_date,
      dropoff_date,
      total_amount,
      pickup_location,
      dropoff_location,
      total_days,
      payment_method: payment_method || 'Cash',
      status: 'pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user bookings (user)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const bookings = await Booking.find({})
        .populate('user_id', 'id full_name email')
        .populate('car_id');
      res.json(bookings);
    } else {
      const bookings = await Booking.find({ user_id: req.user._id })
        .populate('car_id');
      res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      const updatedBooking = await booking.save();
      
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('user_id', 'id full_name email')
        .populate('car_id');
        
      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Check if user is the booking owner or admin
      if (booking.user_id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        const result = await booking.deleteOne();
        res.json({ message: 'Booking removed' });
      } else {
        res.status(401).json({ message: 'Not authorized to delete this booking' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
