import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    
    if (!email || !password || !repeatPassword) {
      toast.error("Fields cannot be empty");
    } else if (password !== repeatPassword) {
      toast.error("Passwords must be the same");
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="register-container"> {}
      <div className="register-content"> {}
        <button onClick={handleBack} className="back-button"></button>   
        <label htmlFor="register">Rejestracja</label>
        <label htmlFor="email-register-label">E-mail</label>
        <input type="text" id="email" /><br />
        <label htmlFor="password-register-label">Hasło</label>
        <input type="password" id="password" /><br/>
        <label htmlFor="password-repeat-label">Powtórz hasło</label>
        <input type="password" id="repeat-password" /><br/><br/> <br />
        <button onClick={handleRegister} className="register-button">Zarejestruj się</button><br />
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};
  
export default Register;
