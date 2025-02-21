const Fine = require("../models/Fine");
const Ebook = require("../models/Ebook");

const calculateFine = (returnDate) => {
  const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
  const currentDate = new Date();
  const overdueTime = currentDate - new Date(returnDate);

  if (overdueTime > twoWeeks) {
    const daysOverdue = Math.floor(overdueTime / (24 * 60 * 60 * 1000)); // Calculate overdue days
    return daysOverdue * 10; // Assume fine of 10 LKR per day
  }
  return 0;
};

const applyFineToUser = async (ebookId, userId) => {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) return { message: "Ebook not found" };

  const fineAmount = calculateFine(ebook.returnDate);

  // Store fine if applicable
  if (fineAmount > 0) {
    const fine = new Fine({
      userId,
      ebookId,
      fineAmount,
    });
    await fine.save();
  }

  return fineAmount;
};

module.exports = { applyFineToUser };
