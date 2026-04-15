import express from 'express';
import Car from '../models/Car.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/cars
// @desc    Fetch all cars
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cars/:id
// @desc    Fetch single car
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cars
// @desc    Create a car
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const car = new Car({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      category: req.body.category,
      fuel_type: req.body.fuel_type,
      transmission: req.body.transmission,
      seats: req.body.seats,
      price_per_day: req.body.price_per_day,
      images: req.body.images,
      location: req.body.location,
      features: req.body.features || [],
      description: req.body.description || '',
      is_available: req.body.is_available !== undefined ? req.body.is_available : true,
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      car.name = req.body.name || car.name;
      car.brand = req.body.brand || car.brand;
      car.model = req.body.model || car.model;
      car.year = req.body.year || car.year;
      car.category = req.body.category || car.category;
      car.fuel_type = req.body.fuel_type || car.fuel_type;
      car.transmission = req.body.transmission || car.transmission;
      car.seats = req.body.seats || car.seats;
      car.price_per_day = req.body.price_per_day || car.price_per_day;
      car.images = req.body.images || car.images;
      car.location = req.body.location || car.location;
      car.features = req.body.features || car.features;
      car.description = req.body.description || car.description;
      if (req.body.is_available !== undefined) {
        car.is_available = req.body.is_available;
      }

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
