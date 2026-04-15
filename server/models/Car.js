import mongoose from 'mongoose';

const carSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    fuel_type: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    price_per_day: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
    },
    description: {
      type: String,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON response
carSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Car = mongoose.model('Car', carSchema);

export default Car;
