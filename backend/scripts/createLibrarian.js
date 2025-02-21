const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config(); // Load the environment variables
const connectDB = require('../config/db');

const createLibrarian = async () => {
    await connectDB();

    // Check if environment variables are being loaded correctly
    console.log('DEFAULT_LIBRARIAN_USERNAME:', process.env.DEFAULT_LIBRARIAN_USERNAME);
    console.log('DEFAULT_LIBRARIAN_PASSWORD:', process.env.DEFAULT_LIBRARIAN_PASSWORD);
    console.log('DEFAULT_LIBRARIAN_EMAIL:', process.env.DEFAULT_LIBRARIAN_EMAIL);

    try {
        // Check if a librarian already exists
        const librarianExists = await User.findOne({ role: 'librarian' });
        if (librarianExists) {
            console.log('Librarian already exists');
            return;
        }

        const { DEFAULT_LIBRARIAN_USERNAME, DEFAULT_LIBRARIAN_PASSWORD, DEFAULT_LIBRARIAN_EMAIL } = process.env;

        // Construct librarian object
        const librarian = new User({
            username: DEFAULT_LIBRARIAN_USERNAME,
            password: DEFAULT_LIBRARIAN_PASSWORD,
            email: DEFAULT_LIBRARIAN_EMAIL,
            role: 'librarian',
        });

        console.log('Librarian object before hashing:', librarian);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        librarian.password = await bcrypt.hash(librarian.password, salt);
        console.log('Hashed password:', librarian.password);

        // Save librarian to the database
        await librarian.save();
        console.log('Librarian created successfully');
    } catch (err) {
        console.error('Error during librarian creation:', err.message);
    } finally {
        mongoose.connection.close();
    }
};

createLibrarian();
