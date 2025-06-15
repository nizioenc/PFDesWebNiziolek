import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Task';
import Lists from './pages/Lists';
import ForoLists from './pages/ForoLists';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/foro" element={<ForoLists />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
