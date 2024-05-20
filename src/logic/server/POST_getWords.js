import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POST_getWords(roleId) {
  return fetch(`${import.meta.env.VITE_URL}/Words/get-words/${roleId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response is not OK");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => toast.error(`${error}`));
}
