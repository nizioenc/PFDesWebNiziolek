class Validators {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  static validateUsername(username) {
    return username && username.length >= 3 && username.length <= 30;
  }

  static validateTaskData(taskData) {
    const { title, description } = taskData;
    
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'El título es requerido' };
    }
    
    if (title.length > 100) {
      return { isValid: false, error: 'El título no puede exceder 100 caracteres' };
    }
    
    if (description && description.length > 500) {
      return { isValid: false, error: 'La descripción no puede exceder 500 caracteres' };
    }
    
    return { isValid: true };
  }

  static validateListData(listData) {
    const { name, description } = listData;
    
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'El nombre es requerido' };
    }
    
    if (name.length > 50) {
      return { isValid: false, error: 'El nombre no puede exceder 50 caracteres' };
    }
    
    if (description && description.length > 200) {
      return { isValid: false, error: 'La descripción no puede exceder 200 caracteres' };
    }
    
    return { isValid: true };
  }

  static validateRatingData(ratingData) {
    const { rating, comment } = ratingData;
    
    if (!rating || rating < 1 || rating > 5) {
      return { isValid: false, error: 'La calificación debe estar entre 1 y 5' };
    }
    
    if (comment && comment.length > 300) {
      return { isValid: false, error: 'El comentario no puede exceder 300 caracteres' };
    }
    
    return { isValid: true };
  }

  static validateObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }
}

const validateRegistration = (userData) => {
  const { username, email, password } = userData;

  if (!username || !email || !password) {
    return { isValid: false, error: 'Todos los campos son requeridos' };
  }

  if (!Validators.validateUsername(username)) {
    return { isValid: false, error: 'El nombre de usuario debe tener entre 3 y 30 caracteres' };
  }

  if (!Validators.validateEmail(email)) {
    return { isValid: false, error: 'El email no es válido' };
  }

  if (!Validators.validatePassword(password)) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { isValid: true };
};

const validateLogin = (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    return { isValid: false, error: 'Email y contraseña son requeridos' };
  }

  if (!Validators.validateEmail(email)) {
    return { isValid: false, error: 'El email no es válido' };
  }

  if (!Validators.validatePassword(password)) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { isValid: true };
};

module.exports = {
  Validators,
  validateRegistration,
  validateLogin
}; 