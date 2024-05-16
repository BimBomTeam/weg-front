export const SET_AUTHORIZE = "SET_AUTHORIZE";

export function setAuthorization(token, firstLogin) {
  return {
    type: SET_AUTHORIZE,
    isAuthenticated: true,
    firstLogin: firstLogin,
    token: token,
  };
}
