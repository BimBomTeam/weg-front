import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Login from "./components/user-interface/login/Login";
import Register from "./components/user-interface/register/Register";
import ValidateToken from "./logic/token/ValidateToken";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ValidateToken />}>
            <Route index element={<Game />} />
            <Route path="/game" element={<Game />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
