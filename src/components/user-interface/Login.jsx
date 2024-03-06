import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/game');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
      <div className="login-container">
        <label htmlFor="email">E-mail</label><br />
        <input type="text" id="email" /><br />
        <label htmlFor="password">Hasło</label><br />
        <input type="password" id="password" /><br />
        <button onClick={handleLogin}>Login</button><br />
        <button onClick={handleRegister}>Rejestracja</button><br />
      </div>
  );
};

export default Login;
