import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
//import Register from './pages/Register';
//import Tasks from './pages/Tasks';
//        <Route path="/register" element={<Register />} />
   //     <Route path="/tasks" element={<Tasks />} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
