import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Lists from './pages/Lists';
import Task from './pages/Task';
import ForoLists from './pages/ForoLists';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/lists" 
            element={
              <PrivateRoute>
                <Lists />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tasks/:listId" 
            element={
              <PrivateRoute>
                <Task />
              </PrivateRoute>
            } 
          />
          <Route path="/foro" element={<ForoLists />} />
          <Route path="/" element={<Navigate to="/lists" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
