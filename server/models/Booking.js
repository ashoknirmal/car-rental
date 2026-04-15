import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Car',
    },
    pickup_date: {
      type: Date,
      required: true,
    },
    dropoff_date: {
      type: Date,
      required: true,
    },
    pickup_location: {
      type: String,
    },
    dropoff_location: {
      type: String,
    },
    total_days: {
      type: Number,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Online Payment'],
      default: 'Cash',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
