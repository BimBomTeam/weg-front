import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      toast.error("Fields cannot be empty");
    } else {
      navigate('/game');
    }
    
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container"> {}
      <div className="login-content"> {}
        <label htmlFor="login">Zaloguj się</label>
        <label htmlFor="email-label">E-mail</label>
        <input type="text" id="email" /><br /> 
        <label htmlFor="password-label">Hasło</label>
        <input type="password" id="password" /><br/><br/>
        <button onClick={handleLogin} className="login-button">Zaloguj się</button><br /> <br/>
        <button onClick={handleRegister} className="register-button">Zarejestruj się</button><br />
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default Login;
