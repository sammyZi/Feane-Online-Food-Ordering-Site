// models/cartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    foodName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

// Create the CartItem model
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
