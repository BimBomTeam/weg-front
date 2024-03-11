import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleRegister = () => {
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
    <div className="register-container">
      <div className="register-content">
        <button onClick={handleBack} className="back-button"></button>   
        <label htmlFor="register">Rejestracja</label>
        <label htmlFor="email-register-label">E-mail</label>
        <input 
          type="text" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <label htmlFor="password-register-label">Hasło</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <label htmlFor="password-repeat-label">Powtórz hasło</label>
        <input 
          type="password" 
          id="repeat-password" 
          value={repeatPassword} 
          onChange={(e) => setRepeatPassword(e.target.value)} 
        />
        <button onClick={handleRegister} className="register-button">
          Zarejestruj się
        </button>
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};
  
export default Register;
