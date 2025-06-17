const Task = require('../models/Task');
const List = require('../models/List');

exports.getTasks = async (userId, listId = null) => {
  try {
    let query = { user: userId };
    
    if (listId) {
      const list = await List.findOne({ _id: listId, user: userId });
      if (!list) {
        return { success: false, error: 'Lista no encontrada' };
      }
      query.list = listId;
    }

    const tasks = await Task.find(query).populate('list', 'name');
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.createTask = async (taskData, userId) => {
  try {
    const { title, description, listId, priority = 'medium', dueDate } = taskData;
    
    if (!title) {
      return { success: false, error: 'El título es requerido' };
    }

    if (listId) {
      const list = await List.findOne({ _id: listId, user: userId });
      if (!list) {
        return { success: false, error: 'Lista no encontrada' };
      }
    }

    const task = new Task({
      title,
      description,
      list: listId,
      user: userId,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await task.save();
    await task.populate('list', 'name');

    return { success: true, data: task };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.updateTask = async (taskId, updateData, userId) => {
  try {
    const task = await Task.findOne({ _id: taskId, user: userId });
    
    if (!task) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    if (updateData.listId) {
      const list = await List.findOne({ _id: updateData.listId, user: userId });
      if (!list) {
        return { success: false, error: 'Lista no encontrada' };
      }
      updateData.list = updateData.listId;
      delete updateData.listId;
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    Object.assign(task, updateData);
    await task.save();
    await task.populate('list', 'name');

    return { success: true, data: task };
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.deleteTask = async (taskId, userId) => {
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    
    if (!task) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    return { success: true, message: 'Tarea eliminada correctamente' };
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.toggleTaskComplete = async (taskId, userId) => {
  try {
    const task = await Task.findOne({ _id: taskId, user: userId });
    
    if (!task) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    
    await task.save();
    await task.populate('list', 'name');

    return { success: true, data: task };
  } catch (error) {
    console.error('Error al cambiar estado de tarea:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}; 