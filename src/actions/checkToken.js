export const CHECK_TOKEN = 'CHECK_TOKEN';

export function checkToken() {
  console.log("ACTION (REDUX)");
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;
  console.log("state in action-->", isAuthenticated);
  return {
    type: CHECK_TOKEN,
    isAuthenticated: isAuthenticated,
  };
}
