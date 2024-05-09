import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerApi from "./registerApi";
import { BsInfoCircle } from "react-icons/bs"; // Dodano import

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !username) {
      toast.error("Fields cannot be empty");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address");
    } else if (password.length < 8) {
      toast.error("Password does not meet the requirements.");
    } else {
      try {
        const { success } = await registerApi({ email, username, password });
        if (success) {
          toast.success("Successfully registered");
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Server Error. Please try again later.");
        } else {
          toast.error("Error with registration");
        }
      }
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="register-container">
        <label htmlFor="register">Rejestracja</label>
        <div className="input-container">
          <button onClick={handleBack} className="back-button"></button>
          <label htmlFor="email-register-label">E-mail</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="name-label">Imie</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password-register-label">
            Hasło
            <BsInfoCircle
              style={{ marginLeft: "5px", cursor: "pointer" }}
              title="Your password should contain at least 8 characters, one uppercase letter, and one special character"
              size={15}
            />
          </label>
          <input
            type="password"
            id="password-reg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister} className="register-button">
            Zarejestruj się
          </button>
        </div>

      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default Register;