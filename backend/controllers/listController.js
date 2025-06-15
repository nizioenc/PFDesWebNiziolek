const List = require('../models/List');

exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las listas' });
  }
};

exports.getList = async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, userId: req.user.id });
    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la lista' });
  }
};

exports.createList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newList = new List({
      name,
      description,
      userId: req.user.id
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la lista' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedList = await List.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la lista' });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedList = await List.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedList) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }
    res.json({ message: 'Lista eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la lista' });
  }
}; 