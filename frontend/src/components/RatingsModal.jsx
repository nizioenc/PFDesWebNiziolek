import React from 'react';
import StarRating from './StarRating';
import '../styles/RatingsModal.css';

const RatingsModal = ({ isOpen, onClose, ratings, averageRating, ratingCount }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reseñas de la Lista</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <StarRating rating={Math.round(averageRating)} readonly />
            <span className="rating-count">({ratingCount} reseñas)</span>
          </div>
        </div>

        <div className="ratings-list">
          {ratings.length === 0 ? (
            <p className="no-ratings">No hay reseñas aún</p>
          ) : (
            ratings.map((rating) => (
              <div key={rating._id} className="rating-item">
                <div className="rating-user">
                  <span className="user-email">{rating.userId.email}</span>
                  <span className="rating-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={rating.rating} readonly />
                {rating.comment && (
                  <div className="rating-comment">
                    <p>{rating.comment}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingsModal; 