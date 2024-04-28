export const CHECK_TOKEN = 'CHECK_TOKEN';

export function checkToken() {
  const token = localStorage.getItem("access_token");
  //тут проверка есть токен / нет токен 
  //нужно проверять его валидность
  const isAuthenticated = token ? true : false;
  return {
    type: CHECK_TOKEN,
    isAuthenticated: isAuthenticated,
  };
}
