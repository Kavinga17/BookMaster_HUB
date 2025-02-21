const express = require('express');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Example user routes (replace with your actual route file if applicable)
const userRoutes = require('backend/routes/user.js'); // Ensure you create this file or update the path

// Health route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Mount user routes
app.use('/api/user', userRoutes);

module.exports = app;
