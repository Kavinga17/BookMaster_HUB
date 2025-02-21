const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ebookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  authors: [{
    type: String
  }],
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  status: {
    type: String,
    enum: ['available', 'issued', 'returned'],
    default: 'available'
  },
  dateIssued: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  issuedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fineAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Ebook', ebookSchema);