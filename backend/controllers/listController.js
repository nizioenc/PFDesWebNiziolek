const listService = require('../services/listService');

exports.getLists = async (req, res) => {
  try {
    const result = await listService.getLists(req.user.id);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getPublicLists = async (req, res) => {
  try {
    const result = await listService.getPublicLists();
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listService.getList(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getPublicList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listService.getPublicList(id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createList = async (req, res) => {
  try {
    const result = await listService.createList(req.body, req.user.id);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listService.updateList(id, req.body, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.togglePublic = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listService.togglePublic(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await listService.deleteList(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json({ message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}; 