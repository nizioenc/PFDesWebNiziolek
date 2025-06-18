const ratingService = require('../services/ratingService');

exports.getListRatings = async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await ratingService.getListRatings(listId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.rateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await ratingService.rateList(listId, req.body, req.user.id);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ratingService.updateRating(id, req.body, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ratingService.deleteRating(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json({ message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getListAverageRating = async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await ratingService.getListAverageRating(listId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}; 