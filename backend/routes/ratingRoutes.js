const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas específicas de listas (deben ir antes que las rutas con parámetros)
router.get('/list/:listId', ratingController.getListRatings);
router.get('/list/:listId/average', ratingController.getListAverageRating);
router.post('/list/:listId', ratingController.rateList);

// Rutas de calificaciones individuales
router.put('/:id', ratingController.updateRating);
router.delete('/:id', ratingController.deleteRating);

module.exports = router; 