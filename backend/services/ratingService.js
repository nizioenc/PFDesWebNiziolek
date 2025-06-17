const Rating = require('../models/Rating');
const List = require('../models/List');

exports.getListRatings = async (listId) => {
  try {
    const ratings = await Rating.find({ list: listId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    return { success: true, data: ratings };
  } catch (error) {
    console.error('Error al obtener ratings:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.getListAverageRating = async (listId) => {
  try {
    const ratings = await Rating.find({ list: listId });
    
    if (ratings.length === 0) {
      return { success: true, data: { average: 0, count: 0 } };
    }

    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const average = total / ratings.length;

    return { 
      success: true, 
      data: { 
        average: Math.round(average * 10) / 10, 
        count: ratings.length 
      } 
    };
  } catch (error) {
    console.error('Error al calcular promedio de ratings:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.rateList = async (listId, ratingData, userId) => {
  try {
    const { rating, comment } = ratingData;
    
    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: 'Rating debe estar entre 1 y 5' };
    }

    const list = await List.findById(listId);
    if (!list) {
      return { success: false, error: 'Lista no encontrada' };
    }

    const existingRating = await Rating.findOne({ list: listId, user: userId });
    
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      await existingRating.save();
      
      const populatedRating = await Rating.findById(existingRating._id)
        .populate('user', 'username');
      
      return { success: true, data: populatedRating };
    }

    const newRating = new Rating({
      list: listId,
      user: userId,
      rating,
      comment: comment || ''
    });

    await newRating.save();
    await newRating.populate('user', 'username');

    return { success: true, data: newRating };
  } catch (error) {
    console.error('Error al crear rating:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.updateRating = async (ratingId, updateData, userId) => {
  try {
    const { rating, comment } = updateData;
    
    if (rating && (rating < 1 || rating > 5)) {
      return { success: false, error: 'Rating debe estar entre 1 y 5' };
    }

    const ratingDoc = await Rating.findOne({ _id: ratingId, user: userId });
    
    if (!ratingDoc) {
      return { success: false, error: 'Rating no encontrado' };
    }

    if (rating) ratingDoc.rating = rating;
    if (comment !== undefined) ratingDoc.comment = comment;
    
    await ratingDoc.save();
    await ratingDoc.populate('user', 'username');

    return { success: true, data: ratingDoc };
  } catch (error) {
    console.error('Error al actualizar rating:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

exports.deleteRating = async (ratingId, userId) => {
  try {
    const rating = await Rating.findOneAndDelete({ _id: ratingId, user: userId });
    
    if (!rating) {
      return { success: false, error: 'Rating no encontrado' };
    }

    return { success: true, message: 'Rating eliminado correctamente' };
  } catch (error) {
    console.error('Error al eliminar rating:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}; 