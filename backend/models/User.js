const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'Username debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Contraseña es requerida'],
    minlength: [6, 'Contraseña debe tener al menos 6 caracteres']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
