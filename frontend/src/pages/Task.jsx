import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Task.css';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', listId: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [token] = useState(localStorage.getItem('token'));

  const navigate = useNavigate();
  const { listId } = useParams();

  const API_URL = 'http://localhost:5000/api';
  const TASKS_URL = `${API_URL}/tasks`;
  const LISTS_URL = `${API_URL}/lists`;

  const fetchLists = async () => {
    try {
      const res = await fetch(LISTS_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLists(data);
      
      if (listId) {
        const selectedList = data.find(list => list._id === listId);
        if (selectedList) {
          setCurrentList(selectedList);
          setFormData(prev => ({ ...prev, listId: selectedList._id }));
        }
      }
    } catch (err) {
      console.error('Error al obtener listas:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const url = currentList 
        ? `${TASKS_URL}?listId=${currentList._id}`
        : TASKS_URL;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      fetchTasks();
    }
  }, [currentList, lists]);

  useEffect(() => {
    if (editingTaskId && lists.length > 0) {
      const task = tasks.find(t => t._id === editingTaskId);
      if (task && task.listId) {
        const taskList = lists.find(list => list._id === task.listId);
        if (taskList) {
          setCurrentList(taskList);
          setFormData(prev => ({ ...prev, listId: taskList._id }));
        }
      }
    }
  }, [editingTaskId, lists, tasks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleListChange = (e) => {
    const selectedList = lists.find(list => list._id === e.target.value);
    setCurrentList(selectedList);
    setFormData(prev => ({ ...prev, listId: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingTaskId ? 'PUT' : 'POST';
    const url = editingTaskId ? `${TASKS_URL}/${editingTaskId}` : TASKS_URL;

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
        setFormData({ title: '', description: '', listId: currentList?._id || '' });
        setEditingTaskId(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Error al guardar tarea:', err);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await fetch(`${TASKS_URL}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await fetch(`${TASKS_URL}/${task._id}`, {
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
    console.log('Editando tarea:', task);
    const taskList = lists.find(list => list._id === task.listId);
    console.log('Lista encontrada:', taskList);
    
    setFormData({ 
      title: task.title, 
      description: task.description,
      listId: task.listId
    });
    
    if (taskList) {
      setCurrentList(taskList);
    }
    
    setEditingTaskId(task._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToLists = () => {
    navigate('/lists');
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>{currentList ? `Tareas de: ${currentList.name}` : 'Todas las tareas'}</h2>
        <button onClick={goToLists} className="back-btn">
          Volver a Listas
        </button>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <h3>{editingTaskId ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
        {!editingTaskId && (
          <select
            name="listId"
            value={formData.listId || ''}
            onChange={handleListChange}
            required
          >
            <option value="">Seleccionar lista</option>
            {lists.map(list => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        )}
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

      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task-card ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              {task.listId && (
                <span className="task-list-tag">
                  {lists.find(l => l._id === task.listId)?.name}
                </span>
              )}
            </div>
            <div className="task-actions">
              <button onClick={() => toggleComplete(task)} className="complete-btn">
                {task.completed ? 'Desmarcar' : 'Completar'}
              </button>
              <button onClick={() => startEdit(task)} className="edit-btn">
                Editar
              </button>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
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

export default Task;
