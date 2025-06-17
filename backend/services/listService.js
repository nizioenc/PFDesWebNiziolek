const List = require('../models/List');
const Task = require('../models/Task');

exports.getLists = async (userId) => {
  try {
    const lists = await List.find({ user: userId }).sort({ createdAt: -1 });
    return { success: true, data: lists };
  } catch (error) {
    console.error('Error al obtener listas:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.createList = async (listData, userId) => {
  try {
    const { name, description, isPublic = false } = listData;
    
    if (!name) {
      return { success: false, error: 'El nombre es requerido' };
    }

    const list = new List({
      name,
      description,
      isPublic,
      user: userId
    });

    await list.save();
    return { success: true, data: list };
  } catch (error) {
    console.error('Error al crear lista:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.getList = async (listId, userId) => {
  try {
    const list = await List.findOne({ _id: listId, user: userId });
    
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    const tasks = await Task.find({ list: listId, user: userId });
    const listWithTasks = list.toObject();
    listWithTasks.tasks = tasks;

    return { success: true, data: listWithTasks };
  } catch (error) {
    console.error('Error al obtener lista:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.updateList = async (listId, updateData, userId) => {
  try {
    const list = await List.findOneAndUpdate(
      { _id: listId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    return { success: true, data: list };
  } catch (error) {
    console.error('Error al actualizar lista:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.deleteList = async (listId, userId) => {
  try {
    const list = await List.findOneAndDelete({ _id: listId, user: userId });
    
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    await Task.deleteMany({ list: listId, user: userId });

    return { success: true, message: 'Lista eliminada correctamente' };
  } catch (error) {
    console.error('Error al eliminar lista:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.togglePublic = async (listId, userId) => {
  try {
    const list = await List.findOne({ _id: listId, user: userId });
    
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    list.isPublic = !list.isPublic;
    await list.save();

    return { success: true, data: list };
  } catch (error) {
    console.error('Error al cambiar visibilidad de lista:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.getPublicLists = async () => {
  try {
    const lists = await List.find({ isPublic: true })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    return { success: true, data: lists };
  } catch (error) {
    console.error('Error al obtener listas públicas:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.getPublicList = async (listId) => {
  try {
    const list = await List.findOne({ _id: listId, isPublic: true })
      .populate('user', 'username');
    
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    const tasks = await Task.find({ list: listId });
    const listWithTasks = list.toObject();
    listWithTasks.tasks = tasks;

    return { success: true, data: listWithTasks };
  } catch (error) {
    console.error('Error al obtener lista pública:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}; 