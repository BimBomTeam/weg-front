import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { checkToken } from "../../actions/checkToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import POST_tokenAuth from "../server/POST_tokenAuth";
import { checkRoles } from "../../actions/roles";

export default function ValidateToken() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);

  useEffect(() => {
    if (token !== undefined) {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!loading) {
      if (token) {
        POST_tokenAuth(); //TO-DO: наверника что-то будет возвращаться, в зависимости от чего пускаем/нет
        // dispatch(checkRoles());
      } else {
        toast.error("Please login. Token expired");
        navigate("/login");
      }
    }
  }, [token, loading, dispatch]);

  //--------TO-DO--------
  //Podczas pierwszego renderowania komponent uruchamia się 3 razy

  return <Outlet></Outlet>;
}
