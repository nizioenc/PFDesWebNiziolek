const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Rating es requerido'],
    min: [1, 'Rating mínimo es 1'],
    max: [5, 'Rating máximo es 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comentario no puede exceder 500 caracteres']
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

ratingSchema.index({ list: 1, user: 1 }, { unique: true });

ratingSchema.index({ list: 1, createdAt: -1 });

module.exports = mongoose.model('Rating', ratingSchema); 