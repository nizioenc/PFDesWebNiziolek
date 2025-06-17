const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de listas del usuario
router.get('/', listController.getLists);
router.post('/', listController.createList);
router.get('/:id', listController.getList);
router.put('/:id', listController.updateList);
router.put('/:id/toggle-public', listController.togglePublic);
router.delete('/:id', listController.deleteList);

module.exports = router; 