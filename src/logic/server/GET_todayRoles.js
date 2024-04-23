import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GET_todayRoles() {
  console.log("GET_todayRoles()");
  // Установите флаг, который будет указывать на доступность сервера
  const isServerAvailable = false; // Предположим, что сервер недоступен

  if (isServerAvailable) {
    // Если сервер доступен, делаем реальный запрос
    return fetch("https://jsonplaceholder.typicode.com/posts", {
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
        return []; // Возвращаем пустой массив в случае ошибки
      });
  } else {
    // Если сервер недоступен, возвращаем тестовые данные
    const testData = `[{"id":1,"name":"Wairtress"},{"id":2,"name":"Cooker"},{"id":3,"name":"Zoologist"},{"id":4,"name":"Buisnessman"},{"id":5,"name":"Teacher"}]`;
    return Promise.resolve(JSON.parse(testData))
      .then((data) => {
        console.log(data);
        return data; // Возвращаем тестовые данные
      })
      .catch((error) => {
        toast.error(`${error}`);
        return []; // Возвращаем пустой массив в случае ошибки
      });
  }
}
