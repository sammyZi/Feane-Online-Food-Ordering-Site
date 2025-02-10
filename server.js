const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid
const Booking = require('./models/booking');  // Import the Booking schema
const User = require('./models/User'); // Import the User schema
const CartItem = require('./models/cart'); // Import the CartItem schema
const MenuItem = require('./models/menuItem');
const https = require('https'); // Add HTTPS module
const fs = require('fs'); // To read the certificate files

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS if needed
app.use(express.static('public')); // Serve static files (e.g., login.html)

const options = {
    key: fs.readFileSync('key.pem'),   // Replace with your SSL key file path
    cert: fs.readFileSync('cert.pem')   // Replace with your SSL certificate file path
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Handle form submissions for bookings
app.post('/book', async (req, res) => {
    const { name, phone, email, persons, date } = req.body;

    const newBooking = new Booking({
        name,
        phone,
        email,
        persons,
        date
    });

    try {
        await newBooking.save();
        res.status(201).json({ message: 'Booking saved successfully!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Handle signup form submissions
app.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, address, age, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists with this email.');
        }

        // Validate phone number (must be 10 digits)
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            return res.status(400).send('Phone number must be exactly 10 digits.');
        }

        // Validate age (must be between 15 and 99)
        if (age < 15 || age > 99) {
            return res.status(400).send('Age must be between 15 and 99.');
        }

        // Validate password (minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).send('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a UUID for the new user
        const userId = uuidv4();

        const newUser = new User({
            name,
            email,
            phone,
            address,
            age,
            password: hashedPassword, // Store hashed password
            id: userId // Add the generated UUID
        });

        await newUser.save(); // Save the user to the database
        res.send('User registered successfully!');
    } catch (error) {
        res.status(400).send(error.message); // Send only the error message
    }
});

// Handle login form submissions
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // User not found, don't specify which one
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Password does not match, use generic message
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Send the user details back, including the unique ID
        res.status(200).json({
            message: 'Login successful!',
            user: {
                name: user.name,
                email: user.email,
                id: user.id // Use _id for MongoDB documents
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log error details for debugging
        res.status(500).json({ error: 'Error during login: ' + error.message });
    }
});

// Handle adding items to the cart
app.post('/add-to-cart', async (req, res) => {
    const { userId, foodName, quantity } = req.body;

    try {
        // Check if the userId exists in the users table
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(401).json({ message: 'User not found. Please log in again.' });
        }

        // Check if the food item exists in the MenuItem collection
        const menuItem = await MenuItem.findOne({ foodName });

        if (!menuItem) {
            return res.status(404).json({ message: 'Food item not found in the menu.' });
        }

        // Ensure the quantity is between 1 and 15
        if (quantity < 1 || quantity > 15) {
            return res.status(400).json({ message: 'Quantity must be between 1 and 15.' });
        }

        // If user exists, food item is found, and quantity is valid, proceed to add item to the cart
        const newItem = new CartItem({
            userId,
            foodName,
            quantity,
            price: menuItem.price // Store the price from the menu items
        });

        await newItem.save(); // Save the item to MongoDB
        res.status(201).json({ message: 'Item added to cart successfully!' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error adding item to cart: ' + error.message });
    }
});

// Fetch items from the cart for a specific user
app.get('/api/cart/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters

    try {
        // Find all cart items associated with the userId
        const cartItems = await CartItem.find({ userId });

        // Check if there are any items in the cart
        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items found in the cart for this user.' });
        }

        // Send the cart items back to the client
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items: ' + error.message });
    }
});

// Delete item from cart
app.delete('/api/cart/:userId/:itemId', async ( req, res) => {
    const { userId, itemId } = req.params;

    try {
        // Find the cart item to delete
        const cartItem = await CartItem.findByIdAndDelete(itemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        // Check if the item belongs to the user
        if (cartItem.userId !== userId) {
            return res.status(401).json({ message: 'You do not have permission to delete this item.' });
        }

        res.status(200).json({ message: 'Item deleted from cart successfully.' });
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        res.status(500).json({ error: 'Error deleting item from cart: ' + error.message });
    }
});

// Update quantity in cart
app.patch('/api/cart/:userId/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    try {
        // Find the cart item to update
        const cartItem = await CartItem.findById(itemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        // Check if the item belongs to the user
        if (cartItem.userId !== userId) {
            return res.status(401).json({ message: 'You do not have permission to update this item.' });
        }

        // Check if the quantity is within the allowed limit (1-15)
        if (quantity < 1 || quantity > 15) {
            return res.status(400).json({ message: 'Quantity must be between 1 and 15.' });
        }

        // Update the quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: 'Quantity updated in cart successfully.' });
    } catch (error) {
        console.error('Error updating quantity in cart:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid request data.' });
        } else {
            return res.status(500).json({ message: 'An error occurred while updating the quantity.' });
        }
    }
});

// Start the server
const PORT = 3000; // or your port number


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});