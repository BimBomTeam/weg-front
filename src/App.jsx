import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Login from "./components/user-interface/login/Login";
import Register from "./components/user-interface/register/Register";
import PreBuildChecker from "./logic/token/PreBuildChecker";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* дублируется потому что если убрать, игра будет продолжаться даже с отсутсвием токена */}
        <PreBuildChecker />
        <Routes>
          <Route path="/" element={<PreBuildChecker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
