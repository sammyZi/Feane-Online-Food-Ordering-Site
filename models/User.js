const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

// Define the User schema
const userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true }, // Generate a unique ID for each user
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true } // Store hashed passwords in production
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
