const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para asegurar que un usuario solo pueda calificar una lista una vez
ratingSchema.index({ listId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema); 