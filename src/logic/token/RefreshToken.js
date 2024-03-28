import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RefreshToken() {
  const navigate = useNavigate();
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(localStorage.getItem("refresh_token")),
  })
    .then((response) => {
      if (response.status === 401) {
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error("RefreshToken - Response is not OK");
      }
      if (response.ok) {
        return response.json().then((data) => {
          return data;
        });
      }
    })
    .catch((error) => toast.error(`${error}`));
}
