import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GET_todayRoles() {
  return fetch(`${import.meta.env.VITE_URL}/Role/get-today-roles`, {
    method: "GET",
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
    .catch((error) => {
      toast.error(`${error}`);
      return [];
    });
}
