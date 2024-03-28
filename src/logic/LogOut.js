import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../actions/logout";

export default function LogOut() {
  const dispatch = useDispatch();
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("LogOut - Response is not OK");
      }
      if (response.ok) {
        dispatch(logout()); //change the state to redux
        localStorage.removeItem("access_token"); //delete the token from localstorage
        localStorage.removeItem("refresh_token"); //delete the token from localstorage
        window.location.reload();
      }
      return response.json();
    })
    .catch((error) => toast.error(`${error}`));
}
