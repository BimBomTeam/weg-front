import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POST_getBossWords(data) {
  return fetch(`${import.meta.env.VITE_URL}/AiCommunication/generate-words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("POST_getBossWords: Response is not OK");
      }

      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => toast.error(`${error}`));
}
