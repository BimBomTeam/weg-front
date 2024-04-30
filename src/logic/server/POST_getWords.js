import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POST_tokenAuth(roleId) {
  return fetch(`https://193.122.12.41/api/Words/get-words/${roleId}`, {
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
