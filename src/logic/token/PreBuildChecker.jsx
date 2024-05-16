import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { setAuthorization } from "../../actions/setAuthorization";
import { checkRoles } from "../../actions/roles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import POST_tokenAuth from "../server/POST_tokenAuth";

export default function PreBuildChecker() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  // const token = useSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const NonTokenLinks = ["/register", "/login"];

  // useEffect(() => {
  //   dispatch(setAuthorization());
  // }, [dispatch]);

  useEffect(() => {
    if (token !== undefined) {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let timer = setTimeout(() => {
      const canvas = document.getElementById("webgl");

      if (
        canvas &&
        (!canvas.hasAttribute("width") || !canvas.hasAttribute("height"))
      ) {
        // window.location.reload();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    console.log("TOKEN", token);
    if (!loading) {
      if (token) {
        //POST_tokenAuth(); //TO-DO: наверняка что-то будет возвращаться, в зависимости от чего пускаем/нет
        // dispatch(checkRoles());
        // navigate("/game");
      } else {
        const currentPath = window.location.pathname;
        if (!NonTokenLinks.includes(currentPath)) {
          // toast.error("Please login. Token expired");
          // navigate("/login");
        }
      }
    }
  }, [token, loading, dispatch, navigate]);

  //--------TO-DO--------
  //Podczas pierwszego renderowania komponent uruchamia się 3 razy

  return <Outlet></Outlet>;
}
