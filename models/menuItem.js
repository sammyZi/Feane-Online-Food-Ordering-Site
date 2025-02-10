const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
        unique: true, // Ensure that each food item name is unique
    },
    price: {
        type: Number,
        required: true,
    },
});

// Create the MenuItem model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
