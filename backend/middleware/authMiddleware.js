const authService = require('../services/authService');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const result = authService.verifyToken(token);
    
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    req.user = result.data;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};
