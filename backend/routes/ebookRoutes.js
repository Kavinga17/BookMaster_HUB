const express = require('express');
const Ebook = require('../models/Ebook');
const router = express.Router();

// Handle book return
router.put('/return/:ebookId', async (req, res) => {
  const { ebookId } = req.params;
  const userId = req.user.id; // Assuming user ID is attached to the request (from auth middleware)
  
  try {
    // Find the ebook by its ID and check if it's issued to the correct user
    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: 'Ebook not found' });
    }

    // Check if the book is actually issued (has issuedTo property)
    if (!ebook.issuedTo) {
      return res.status(400).json({ message: 'This book is not currently issued to anyone' });
    }

    // Convert ObjectId to string for comparison
    if (ebook.issuedTo.toString() !== userId) {
      return res.status(403).json({ message: 'You cannot return this book' });
    }

    // Calculate fine if the return date is overdue
    const currentDate = new Date();
    let fine = 0;
    if (ebook.returnDate && currentDate > new Date(ebook.returnDate)) {
      const overdueDays = Math.ceil((currentDate - new Date(ebook.returnDate)) / (1000 * 3600 * 24));
      fine = overdueDays * 10; // Fine of $10 per day
    }

    // If fine exists, don't allow return until fine is paid
    if (fine > 0) {
      return res.status(400).json({ message: `Please pay your fine of LKR ${fine} before returning the book` });
    }

    // Update the ebook status to returned and clear the issuedTo field
    ebook.status = 'available';     // Changed from 'returned' to 'available'
    ebook.fineAmount = 0;          // Reset fine amount
    ebook.actualReturnDate = currentDate;  // Record actual return date
    ebook.issuedTo = null;         // Clear the issued user
    ebook.returnDate = null;       // Clear the expected return date

    // Save the updated ebook
    await ebook.save();

    res.status(200).json({ message: 'Book returned successfully', fineAmount: fine });
  } catch (err) {
    console.error('Detailed error:', err.message, err.stack);
    res.status(500).json({ message: 'Error returning book', error: err.message });
  }
});

// Route to handle notifying admin about return
router.post('/notify-admin-return', async (req, res) => {
  const { ebookId } = req.body;
  const userId = req.user.id;
  
  try {
    // Find the ebook by its ID
    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: 'Ebook not found' });
    }

    // Verify this book is issued to the requesting user
    if (!ebook.issuedTo || ebook.issuedTo.toString() !== userId) {
      return res.status(403).json({ message: 'You cannot return this book' });
    }
    
    // Mark the book as pending return (assuming you want an admin to approve)
    ebook.status = 'pendingReturn';
    await ebook.save();
    
    res.status(200).json({ message: 'Return request sent to admin' });
  } catch (err) {
    console.error('Notify admin error:', err.message, err.stack);
    res.status(500).json({ message: 'Error processing return request', error: err.message });
  }
});

// Route to handle fine payment
router.post('/pay-fine', async (req, res) => {
  const { fineAmount, paymentId } = req.body;
  const userId = req.user.id; 

  if (!fineAmount || !paymentId) {
    return res.status(400).json({ message: 'Missing required payment information' });
  }

  try {
    
    res.status(200).json({ 
      message: 'Fine paid successfully',
      transactionId: paymentId,
      amountPaid: fineAmount 
    });
  } catch (err) {
    console.error('Payment processing error:', err.message);
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
});

module.exports = router;