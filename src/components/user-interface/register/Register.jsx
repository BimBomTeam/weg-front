import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerApi from "./registerApi";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !username) {
      toast.error("Fields cannot be empty");
    }
    // else if (!password) {
    //   toast.error("Passwords must be the same");
    // }
    else {
      try {
        const { success } = await registerApi({ email, username, password });
        toast.success("Successfully registered");
        if (success) {
          toast.success("Successfully registered");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Error with registration");
      }
    }
  };

  const handleBack = () => {
    navigate("/login");
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
        <label htmlFor="password-repeat-label">Imie</label>
        <input
          type="text"
          id="repeat-password"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-register-label">Hasło</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
