const Rating = require('../models/Rating');
const List = require('../models/List');

// Obtener todas las calificaciones de una lista
exports.getListRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ listId: req.params.listId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las calificaciones' });
  }
};

// Crear o actualizar una calificación
exports.rateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { rating, comment } = req.body;

    // Verificar que la lista existe y es pública
    const list = await List.findOne({ _id: listId, isPublic: true });
    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada o no es pública' });
    }

    // Verificar que el usuario no está calificando su propia lista
    if (list.userId.toString() === req.user.id) {
      return res.status(400).json({ error: 'No puedes calificar tu propia lista' });
    }

    // Buscar si ya existe una calificación del usuario
    const existingRating = await Rating.findOne({
      listId,
      userId: req.user.id
    });

    if (existingRating) {
      // Actualizar calificación existente
      existingRating.rating = rating;
      if (comment !== undefined) {
        existingRating.comment = comment;
      }
      await existingRating.save();
      res.json(existingRating);
    } else {
      // Crear nueva calificación
      const newRating = new Rating({
        listId,
        userId: req.user.id,
        rating,
        comment
      });
      await newRating.save();
      res.status(201).json(newRating);
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Ya has calificado esta lista' });
    } else {
      res.status(500).json({ error: 'Error al calificar la lista' });
    }
  }
};

// Obtener el promedio de calificaciones de una lista
exports.getListAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ listId: req.params.listId });
    if (ratings.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / ratings.length;

    res.json({
      average: parseFloat(average.toFixed(1)),
      count: ratings.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el promedio de calificaciones' });
  }
}; 