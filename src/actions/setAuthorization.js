export const SET_AUTHORIZE = "SET_AUTHORIZE";
export const SET_FIRST_LOGIN = "SET_FIRST_LOGIN";

export function setAuthorization(accessToken, refreshToken, firstLogin) {
  return {
    type: SET_AUTHORIZE,
    isAuthenticated: true,
    firstLogin: firstLogin,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export function setFirstLogin(firstLogin) {
  return {
    type: SET_FIRST_LOGIN,
    firstLogin: firstLogin,
  };
}
