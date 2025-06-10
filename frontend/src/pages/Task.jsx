import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Task.css';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [token] = useState(localStorage.getItem('token'));

  const navigate = useNavigate(); // hook para redirigir

  const API_URL = 'http://localhost:5000/api/tasks';

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingTaskId ? 'PUT' : 'POST';
    const url = editingTaskId ? `${API_URL}/${editingTaskId}` : API_URL;

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
        setFormData({ title: '', description: '' });
        setEditingTaskId(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Error al guardar tarea:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, completed: !task.completed })
      });
      fetchTasks();
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
    }
  };

  const startEdit = (task) => {
    setFormData({ title: task.title, description: task.description });
    setEditingTaskId(task._id);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');  // elimina token
    navigate('/login');                 // redirige a login
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{editingTaskId ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        <input
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingTaskId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              background: '#fff',
              padding: '15px',
              marginBottom: '12px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </h3>
            <p>{task.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="register-btn" onClick={() => toggleComplete(task)}>
                {task.completed ? 'Desmarcar' : 'Completar'}
              </button>
              <button className="register-btn" onClick={() => startEdit(task)}>
                Editar
              </button>
              <button
                className="register-btn"
                onClick={() => deleteTask(task._id)}
                style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: '40px',
          background: 'transparent',
          border: 'none',
          color: '#999',
          cursor: 'pointer',
          fontSize: '0.9rem',
          textDecoration: 'underline',
          opacity: 0.6,
          alignSelf: 'center',
          display: 'block',
          width: '100%'
        }}
        title="Cerrar sesión"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Task;
