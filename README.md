# FoodExpress Web Application

## Overview
FoodExpress is an interactive and user-friendly web application designed to provide a seamless food ordering experience. The platform allows users to explore various food categories, add items to their cart, and place orders. MongoDB is used as the backend for storing user and cart data.

## Features
- **User Authentication:** Sign-up and login functionality with email verification.
- **Food Menu:** Includes various categories like pizza, burgers, and fries.
- **Add to Cart:** Users can add food items to the cart and adjust quantities.
- **Cart Management:** View and manage cart items dynamically.
- **Order Now Page:** A visually appealing page for placing food orders.
- **Profile Management:** User profile page with stored information.
- **Responsive Design:** Optimized for different devices.
- **Backend:** Node.js server with MongoDB for data storage.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Bcrypt for password hashing
- **Server:** HTTPS setup for secure communication

## Installation and Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sammyZi/Feane-Online-Food-Ordering-Site.git
   cd Feane-Online-Food-Ordering-Site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate SSL certificates:**
   ```bash
   openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
   ```
   > Note: Use these certificates for development purposes only.

4. **Start the server:**
   ```bash
   node server.js
   ```

5. **Access the application:** Open [https://localhost:3000](https://localhost:3000) in your web browser.

## Prerequisites
Make sure to have the following software installed:
- **Node.js:** [Download Node.js](https://nodejs.org/)
- **MongoDB:** [Download MongoDB](https://www.mongodb.com/try/download/community)

## Project Structure
```
Feane-Online-Food-Ordering-Site/
├── server.js        # Node.js server file
├── public/           # Static files (CSS, JS, Images)
├── views/            # HTML templates
├── routes/           # Application routes
├── models/           # Mongoose schemas
├── controllers/      # Request handlers
└── README.md         # Project documentation
```

## API Endpoints
- **GET /foods:** Fetch available food items.
- **POST /cart:** Add item to the cart.
- **GET /cart:** Retrieve cart items.
- **POST /signup:** User registration.
- **POST /login:** User login.

## Security Features
- **Password Hashing:** Secure storage using bcrypt.
- **Data Validation:** Backend validation for user input.
- **HTTPS:** Secure communication using SSL certificates.

## Future Enhancements
- Payment gateway integration.
- Order tracking system.
- Admin dashboard for managing orders and menu items.

# Restaurant Menu Items Data Import Guide

This guide explains how to import the `restaurant.menuitems.json` file into the `menuitems` collection in your MongoDB database.

---


