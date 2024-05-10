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
      return toast.error("Fields cannot be empty");
    }

    try {
      const { success } = await loginApi({ email, password });
      if (success) {
        toast.success("Successfully login");
        dispatch(checkToken());
        setTimeout(() => {
          navigate("/game");
        }, 2500);
      }
    } catch (error) {
      toast.error(error.message || "Authentication Error");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div>
    <div className="login-container">
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
      <button onClick={handleLogin} className="login-button">
        Zaloguj się
      </button>
      <button onClick={handleRegister} className="to-register-button">
        Zarejestruj się
      </button>
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default Login;