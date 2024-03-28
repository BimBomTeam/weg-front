import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../actions/checkToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import POST_tokenAuth from "../server/POST_tokenAuth";

export default function ValidateToken() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.isAuthenticated);
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
        POST_tokenAuth();
        navigate("/game");
      } else { 
        toast.error("Please login. Token expired");
        navigate("/login");
      }
    }
  }, [token, navigate, loading]);

  //--------TO-DO--------
  //Podczas pierwszego renderowania komponent uruchamia się 3 razy
  

  return null; 
}
