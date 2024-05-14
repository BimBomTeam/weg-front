import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Login from "./components/user-interface/login/Login";
import Register from "./components/user-interface/register/Register";
import PreBuildChecker from "./logic/token/PreBuildChecker";
import Error404 from "./components/user-interface/user-interface/hints/Error404";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PreBuildChecker />}>
            <Route index element={<Game />} />
            <Route path="/game" element={<Game />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
