// models/booking.js

const mongoose = require('mongoose');

// Define the schema for booking
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  persons: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model for use in other files
module.exports = Booking;
