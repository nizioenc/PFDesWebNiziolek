const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener calificaciones de una lista
router.get('/list/:listId', ratingController.getListRatings);

// Obtener promedio de calificaciones de una lista
router.get('/list/:listId/average', ratingController.getListAverageRating);

// Crear o actualizar una calificación
router.post('/list/:listId', ratingController.rateList);

module.exports = router; 