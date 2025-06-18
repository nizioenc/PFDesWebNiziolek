import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Task.css';

const PublicTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [list, setList] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const { listId } = useParams();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  const fetchPublicList = async () => {
    try {
      const res = await fetch(`${API_URL}/public/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setList(data);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error al obtener lista pública:', err);
    }
  };

  useEffect(() => {
    fetchPublicList();
  }, [listId]);

  const goToForo = () => {
    navigate('/foro');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>{list?.name || 'Lista Pública'}</h2>
        <div className="task-actions">
          <button onClick={goToForo} className="back-btn">
            Volver al Foro
          </button>
        </div>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas en esta lista</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description || 'Sin descripción'}</p>
                <div className="task-meta">
                  <span className={`status ${task.status}`}>
                    {task.status === 'pending' ? 'Pendiente' : 
                     task.status === 'in-progress' ? 'En progreso' : 
                     task.status === 'completed' ? 'Completada' : task.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Cerrar sesión
      </button>
    </div>
  );
};

export default PublicTasks; 