import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import loginApi from "./loginApi";
import { setAuthorization } from "../../../actions/setAuthorization";
import { useDispatch } from "react-redux";
import api from "../../../axiosConfig";

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
      // const { success } = await loginApi({ email, password });
      const response = await api.post("/Authenticate/login", {
        email,
        password,
      });
      console.log("response", response);

      if (response.status === 200) {
        toast.success("Successfully login");
        const { token, refreshToken, firstLogin } = response.data;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(setAuthorization(token, firstLogin));
        setTimeout(() => {
          window.location.reload();
          navigate("/game");
        }, 2000);
      } else {
        toast.error("Error in login: ", response.data);
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
