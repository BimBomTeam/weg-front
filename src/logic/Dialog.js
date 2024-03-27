import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshToken from "./token/RefreshToken";

export default function DialogForm(text) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text: text }),
  })
    .then((response) => {
      if (response.status === 401) {
        RefreshToken().then((tokenRefreshed) => {
          if (tokenRefreshed) {
            localStorage.setItem("token", tokenRefreshed);
            DialogForm(text);
          }
        });
      }
      if (!response.ok) {
        throw new Error("Response is not OK");
      }
      return response.json();
    })
    .catch((error) => toast.error(`${error}`));
}
