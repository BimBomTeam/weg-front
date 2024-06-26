import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POST_tokenAuth(token) {
  const data = {
    token: token,
  };
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response is not OK");
      }
      return response.json();
    })
    .catch((error) => toast.error(`${error}`));
}
