const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// Rutas públicas (sin autenticación)
router.get('/lists', listController.getPublicLists);
router.get('/lists/:id', listController.getPublicList);

module.exports = router; 