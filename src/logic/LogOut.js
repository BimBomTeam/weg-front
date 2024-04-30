import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogOut() {
  return fetch("https://193.122.12.41/api/Authenticate/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      // TO-DO
      // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((response) => {
      // TO-DO
      // if (!response.ok) {
      //   throw new Error("LogOut - Response is not OK");
      // }
      if (!response.ok) {
        localStorage.removeItem("access_token"); //delete the token from localstorage
        localStorage.removeItem("refresh_token"); //delete the token from localstorage
        sessionStorage.clear();
        window.location.reload();
      }
      return response.json();
    })
    .catch((error) => toast.error(`${error}`));
}
