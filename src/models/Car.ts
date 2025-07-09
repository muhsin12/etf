import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  make: {
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
  price: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  engineSize: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Manual', 'Automatic'],
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  images: [{
    url: String,
    key: String,
  }],
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
  },
  bodyType: {
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon', 'Van', 'Truck'],
  },
  registrationYear: {
    type: Number,
    required: true,
  },
  vin: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CarSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);