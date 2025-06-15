import React from 'react';
import '../styles/StarRating.css';

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onRatingChange(star)}
          onKeyPress={(e) => {
            if (!readonly && (e.key === 'Enter' || e.key === ' ')) {
              onRatingChange(star);
            }
          }}
          role={readonly ? 'presentation' : 'button'}
          tabIndex={readonly ? -1 : 0}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating; 