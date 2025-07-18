const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { listId } = req.query;
    const query = { userId: req.user.id };
    
    if (listId) {
      query.listId = listId;
    }
    
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, listId } = req.body;
    const newTask = new Task({
      title,
      description,
      listId,
      userId: req.user.id
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
