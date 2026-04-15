import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Use an environment variable or dummy test key if missing (so the app doesn't crash)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_someDummyKey';
const stripe = new Stripe(stripeKey);

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { booking_id, car_name, total_amount } = req.body;

    if (!booking_id || !total_amount) {
      return res.status(400).json({ message: 'Missing booking_id or total_amount' });
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(total_amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Car Rental: ${car_name || 'Vehicle'}`,
              description: `Booking ID: ${booking_id}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
      client_reference_id: booking_id.toString(),
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// Verify session and update booking status
router.post('/verify-session', async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const bookingId = session.client_reference_id;
      if (bookingId) {
        // Update the booking status to confirmed if the payment went through
        const booking = await Booking.findById(bookingId);
        if (booking && booking.status === 'pending') {
          booking.status = 'confirmed';
          await booking.save();
        }
      }
      return res.json({ success: true, booking_id: session.client_reference_id });
    }
    
    return res.json({ success: false, status: session.payment_status });
  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

export default router;
