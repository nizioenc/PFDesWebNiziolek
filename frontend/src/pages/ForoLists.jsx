import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForoLists.css';

const ForoLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api/lists';

  const fetchPublicLists = async () => {
    try {
      const res = await fetch(`${API_URL}/public`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPublicLists(data);
    } catch (err) {
      console.error('Error al obtener listas públicas:', err);
    }
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

      <div className="foro-grid">
        {publicLists.map((list) => (
          <div key={list._id} className="foro-card">
            <div className="foro-card-header">
              <h3>{list.name}</h3>
              <span className="author-tag">
                Por: {list.userId.email}
              </span>
            </div>
            <p>{list.description}</p>
            <div className="foro-card-footer">
              <span className="date-tag">
                {new Date(list.createdAt).toLocaleDateString()}
              </span>
              <button onClick={() => viewTasks(list._id)} className="view-tasks-btn">
                Ver Tareas
              </button>
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
    </div>
  );
};

export default ForoLists; 