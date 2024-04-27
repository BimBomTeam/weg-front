import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GET_todayRoles() {
  return fetch("https://193.122.12.41/api/Role/get-today-roles", {
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      toast.error(`${error}`);
      return [];
    });
}
