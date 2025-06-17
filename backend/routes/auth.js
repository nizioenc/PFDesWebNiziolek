const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await authService.getUserById(req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const result = await authService.updateUser(req.user.id, req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
