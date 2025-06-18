import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lists.css';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
        setFormData({ name: '', description: '', isPublic: false });
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
    setFormData({ 
      name: list.name, 
      description: list.description,
      isPublic: list.isPublic || false 
    });
    setEditingListId(list._id);
  };

  const viewTasks = (listId) => {
    navigate(`/tasks/${listId}`);
  };

  const goToForo = () => {
    navigate('/foro');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="lists-container">
      <div className="lists-header">
        <h2>Mis Listas</h2>
        <button onClick={goToForo} className="foro-btn">
          Ver Foro de Listas
        </button>
      </div>

      <form className="lists-form" onSubmit={handleSubmit}>
        <h3>{editingListId ? 'Editar Lista' : 'Nueva Lista'}</h3>
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
        <div className="public-option">
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            Hacer pública esta lista
          </label>
        </div>
        <button type="submit">
          {editingListId ? 'Actualizar' : 'Crear Lista'}
        </button>
      </form>

      <div className="lists-grid">
        {lists.map((list) => (
          <div key={list._id} className="list-card">
            <div className="list-header">
              <h3>{list.name}</h3>
              {list.isPublic && <span className="public-tag">Pública</span>}
            </div>
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