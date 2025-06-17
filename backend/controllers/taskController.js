const taskService = require('../services/taskService');

exports.getTasks = async (req, res) => {
  try {
    const { listId } = req.query;
    const result = await taskService.getTasks(req.user.id, listId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const result = await taskService.createTask(req.body, req.user.id);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.updateTask(id, req.body, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTask(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json({ message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.toggleTaskComplete(id, req.user.id);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
