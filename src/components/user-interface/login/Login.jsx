import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginApi from "./loginApi";
import { checkToken } from "../../../actions/checkToken";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Fields cannot be empty");
    }

    try {
      const { success } = await loginApi({ email, password });
      if (success) {
        toast.success("Successfully registered");
        dispatch(checkToken());
        setTimeout(() => {
          navigate("/game");
        }, 1200); // Задержка в 1 секунду (1000 миллисекунд)
      }
    } catch (error) {
      toast.error("Authentication Error");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <label htmlFor="login">Zaloguj się</label>
        <label htmlFor="email-label">E-mail</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password-label">Hasło</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-buttonBlock">
          <button onClick={handleLogin} className="login-button">
            Zaloguj się
          </button>
          <button onClick={handleRegister} className="to-register-button">
            Zarejestruj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
