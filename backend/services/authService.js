const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../utils/validators');

exports.register = async (userData) => {
  try {
    const validation = validateRegistration(userData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const existingUser = await User.findOne({ 
      $or: [{ email: userData.email }, { username: userData.username }] 
    });

    if (existingUser) {
      return { success: false, error: 'El email o username ya está registrado' };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.login = async (credentials) => {
  try {
    const validation = validateLogin(credentials);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const user = await User.findOne({ 
      $or: [{ email: credentials.email }, { username: credentials.email }] 
    });

    if (!user) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: 'Token inválido' };
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.updateUser = async (userId, updateData) => {
  try {
    const allowedUpdates = ['username', 'email'];
    const updates = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return { success: false, error: 'No hay campos válidos para actualizar' };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}; 