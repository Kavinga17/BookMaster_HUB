// controllers/fineController.js
const Fine = require('../models/Fine');

// View all fines for a user
const viewFines = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all fines for the specified user
        const fines = await Fine.find({ userId });

        if (!fines) {
            return res.status(404).json({ message: 'No fines found for this user' });
        }

        res.status(200).json(fines);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching fines' });
    }
};

// Pay a fine (mark it as paid)
const payFine = async (req, res) => {
    const { fineId } = req.params;

    try {
        // Find the fine by ID
        const fine = await Fine.findById(fineId);

        if (!fine) {
            return res.status(404).json({ message: 'Fine not found' });
        }

        // Mark the fine as paid
        fine.paid = true;
        await fine.save();

        res.status(200).json({ message: 'Fine paid successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error processing fine payment' });
    }
};

// View the fine payment history
const viewFinePaymentHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all fines that have been paid by the specified user
        const paidFines = await Fine.find({ userId, paid: true });

        if (!paidFines) {
            return res.status(404).json({ message: 'No paid fines found for this user' });
        }

        res.status(200).json(paidFines);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching fine payment history' });
    }
};

module.exports = {
    viewFines,
    payFine,
    viewFinePaymentHistory
};
