import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lists.css';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingListId, setEditingListId] = useState(null);
  const [token] = useState(localStorage.getItem('token'));

  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api/lists';

  const fetchLists = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLists(data);
    } catch (err) {
      console.error('Error al obtener listas:', err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingListId ? 'PUT' : 'POST';
    const url = editingListId ? `${API_URL}/${editingListId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: '', description: '' });
        setEditingListId(null);
        fetchLists();
      }
    } catch (err) {
      console.error('Error al guardar lista:', err);
    }
  };

  const deleteList = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLists();
      } catch (err) {
        console.error('Error al eliminar lista:', err);
      }
    }
  };

  const startEdit = (list) => {
    setFormData({ name: list.name, description: list.description });
    setEditingListId(list._id);
  };

  const viewTasks = (listId) => {
    navigate(`/tasks?listId=${listId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="lists-container">
      <form className="lists-form" onSubmit={handleSubmit}>
        <h2>{editingListId ? 'Editar Lista' : 'Nueva Lista'}</h2>
        <input
          name="name"
          placeholder="Nombre de la lista"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">
          {editingListId ? 'Actualizar' : 'Crear Lista'}
        </button>
      </form>

      <div className="lists-grid">
        {lists.map((list) => (
          <div key={list._id} className="list-card">
            <h3>{list.name}</h3>
            <p>{list.description}</p>
            <div className="list-actions">
              <button onClick={() => viewTasks(list._id)} className="view-tasks-btn">
                Ver Tareas
              </button>
              <button onClick={() => startEdit(list)} className="edit-btn">
                Editar
              </button>
              <button onClick={() => deleteList(list._id)} className="delete-btn">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Cerrar sesión
      </button>
    </div>
  );
};

export default Lists; 