import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import RatingsModal from '../components/RatingsModal';
import '../styles/ForoLists.css';

const ForoLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const [selectedList, setSelectedList] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [userComments, setUserComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  const fetchPublicLists = async () => {
    try {
      const res = await fetch(`${API_URL}/public/lists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPublicLists(data);
      
      // Obtener calificaciones promedio para cada lista
      data.forEach(list => {
        fetchAverageRating(list._id);
        fetchUserRating(list._id);
      });
    } catch (err) {
      console.error('Error al obtener listas públicas:', err);
    }
  };

  const fetchAverageRating = async (listId) => {
    try {
      const res = await fetch(`${API_URL}/ratings/list/${listId}/average`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAverageRatings(prev => ({
          ...prev,
          [listId]: data
        }));
      } else {
        console.error('Error al obtener calificación promedio:', res.status);
      }
    } catch (err) {
      console.error('Error al obtener calificación promedio:', err);
    }
  };

  const fetchUserRating = async (listId) => {
    try {
      const res = await fetch(`${API_URL}/ratings/list/${listId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const userRating = data.find(rating => rating.userId._id === JSON.parse(atob(token.split('.')[1])).id);
      if (userRating) {
        setUserRatings(prev => ({
          ...prev,
          [listId]: userRating.rating
        }));
        setUserComments(prev => ({
          ...prev,
          [listId]: userRating.comment || ''
        }));
      }
    } catch (err) {
      console.error('Error al obtener calificación del usuario:', err);
    }
  };

  const handleRating = async (listId, rating) => {
    try {
      const res = await fetch(`${API_URL}/ratings/list/${listId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rating,
          comment: userComments[listId] || ''
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUserRatings(prev => ({
          ...prev,
          [listId]: rating
        }));
        
        // Actualizar inmediatamente el promedio
        await fetchAverageRating(listId);
        
        if (selectedList?._id === listId) {
          fetchRatings(listId);
        }
        setShowCommentInput(listId);
      } else {
        alert(data.error || 'Error al calificar la lista');
      }
    } catch (err) {
      console.error('Error al calificar lista:', err);
      alert('Error al calificar la lista');
    }
  };

  const handleCommentChange = (listId, comment) => {
    setUserComments(prev => ({
      ...prev,
      [listId]: comment
    }));
  };

  const handleCommentSubmit = async (listId) => {
    try {
      const res = await fetch(`${API_URL}/ratings/list/${listId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rating: userRatings[listId] || 1,
          comment: userComments[listId]
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowCommentInput(null);
        if (selectedList?._id === listId) {
          fetchRatings(listId);
        }
      } else {
        alert(data.error || 'Error al guardar el comentario');
      }
    } catch (err) {
      console.error('Error al guardar comentario:', err);
      alert('Error al guardar el comentario');
    }
  };

  const fetchRatings = async (listId) => {
    try {
      const res = await fetch(`${API_URL}/ratings/list/${listId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRatings(data);
    } catch (err) {
      console.error('Error al obtener calificaciones:', err);
    }
  };

  const openRatingsModal = async (list) => {
    setSelectedList(list);
    await fetchRatings(list._id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPublicLists();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToLists = () => {
    navigate('/lists');
  };

  const viewTasks = (listId) => {
    navigate(`/tasks?listId=${listId}`);
  };

  return (
    <div className="foro-container">
      <div className="foro-header">
        <h2>Foro de Listas</h2>
        <div className="foro-actions">
          <button onClick={goToLists} className="back-btn">
            Mis Listas
          </button>
        </div>
      </div>

      <div className="foro-lists">
        {publicLists.map(list => (
          <div key={list._id} className="foro-card">
            <div className="foro-card-header">
              <h3>{list.name}</h3>
              <span className="author">por {list.userId?.username || 'Usuario'}</span>
            </div>

            <div className="foro-card-body">
              <p className="description">{list.description || 'Sin descripción'}</p>
              
              <div className="rating-section">
                <div className="average-rating">
                  <span>Calificación promedio:</span>
                  <StarRating 
                    rating={averageRatings[list._id]?.average || 0} 
                    readonly={true}
                  />
                  <span className="rating-average-number">
                    {averageRatings[list._id]?.average?.toFixed(1) || '0.0'}
                  </span>
                  <span className="rating-count">
                    ({averageRatings[list._id]?.count || 0} reseñas)
                  </span>
                </div>

                {list.userId._id !== JSON.parse(atob(token.split('.')[1])).id && (
                  <div className="user-rating">
                    <span>Tu calificación:</span>
                    <StarRating
                      rating={userRatings[list._id] || 0}
                      onRatingChange={(rating) => handleRating(list._id, rating)}
                    />
                    {showCommentInput === list._id && (
                      <div className="comment-input">
                        <textarea
                          placeholder="Escribe un comentario (opcional)"
                          value={userComments[list._id] || ''}
                          onChange={(e) => handleCommentChange(list._id, e.target.value)}
                          maxLength={500}
                        />
                        <div className="comment-actions">
                          <span className="char-count">
                            {userComments[list._id]?.length || 0}/500
                          </span>
                          <button 
                            onClick={() => handleCommentSubmit(list._id)}
                            className="submit-comment-btn"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="foro-card-footer">
              <span className="date-tag">
                {new Date(list.createdAt).toLocaleDateString()}
              </span>
              <div className="card-actions">
                <button 
                  onClick={() => openRatingsModal(list)} 
                  className="view-ratings-btn"
                >
                  Ver Reseñas
                </button>
                <button 
                  onClick={() => viewTasks(list._id)} 
                  className="view-tasks-btn"
                >
                  Ver Tareas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {publicLists.length === 0 && (
        <div className="no-lists">
          <p>No hay listas públicas disponibles</p>
        </div>
      )}

      <button onClick={handleLogout} className="logout-btn">
        Cerrar sesión
      </button>

      <RatingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ratings={ratings}
        averageRating={selectedList ? (averageRatings[selectedList._id]?.average || 0) : 0}
        ratingCount={selectedList ? (averageRatings[selectedList._id]?.count || 0) : 0}
      />
    </div>
  );
};

export default ForoLists; 