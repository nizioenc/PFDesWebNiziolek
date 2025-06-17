exports.successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: error.message || error
  });
};

exports.notFoundResponse = (res, message = 'Recurso no encontrado') => {
  res.status(404).json({
    success: false,
    error: message
  });
};

exports.unauthorizedResponse = (res, message = 'No autorizado') => {
  res.status(401).json({
    success: false,
    error: message
  });
};

exports.forbiddenResponse = (res, message = 'Acceso prohibido') => {
  res.status(403).json({
    success: false,
    error: message
  });
};

exports.serverErrorResponse = (res, error = 'Error interno del servidor') => {
  res.status(500).json({
    success: false,
    error
  });
}; 