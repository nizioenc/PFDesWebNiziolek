const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nombre es requerido'],
    trim: true,
    maxlength: [100, 'Nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descripción no puede exceder 500 caracteres']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

listSchema.index({ user: 1, createdAt: -1 });
listSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('List', listSchema); 