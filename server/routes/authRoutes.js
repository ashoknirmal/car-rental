import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password does not meet security requirements' });
    }

    const user = await User.create({
      full_name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number,
      address: user.address,
      city: user.city,
      driving_license: user.driving_license,
      avatar_url: user.avatar_url,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.full_name !== undefined) user.full_name = req.body.full_name;
      if (req.body.phone_number !== undefined) user.phone_number = req.body.phone_number;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.city !== undefined) user.city = req.body.city;
      if (req.body.driving_license !== undefined) user.driving_license = req.body.driving_license;
      if (req.body.avatar_url !== undefined) user.avatar_url = req.body.avatar_url;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address,
        city: updatedUser.city,
        driving_license: updatedUser.driving_license,
        avatar_url: updatedUser.avatar_url,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
