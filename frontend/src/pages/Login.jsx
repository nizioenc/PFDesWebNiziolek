import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const location = useLocation();
  const successMessage = location.state?.successMessage || '';
  const [showSuccess, setShowSuccess] = useState(!!successMessage);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas');
      } else {
        localStorage.setItem('token', data.token);
        onLogin && onLogin();
        navigate('/lists'); 
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };
    const goToRegister = () => {
    navigate('/register');
  };

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }
}, [successMessage]);


return (
  <>
    {showSuccess && (
      <div className="success-alert">{successMessage}</div>
    )}

    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>

      <button className="register-btn" onClick={goToRegister}>
        Crear Cuenta Nueva
      </button>
    </div>
  </>
);

};

export default Login;
