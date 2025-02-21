// models/Fine.js
const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // Reference to User model, if you're using a user collection
    },
    fineAmount: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    paymentDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Fine = mongoose.model('Fine', fineSchema);

module.exports = Fine;
