import { SET_AUTHORIZE, SET_FIRST_LOGIN } from "../actions/setAuthorization";
import { LOGOUT } from "../actions/logout";

const initialState = {
  isAuthenticated: false,
  firstLogin: false,
  refreshToken: null,
  accessToken: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FIRST_LOGIN:
      return {
        ...state,
        firstLogin: action.firstLogin,
      };
    case SET_AUTHORIZE:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        firstLogin: action.firstLogin,
        refreshToken: action.refreshToken,
        accessToken: action.accessToken,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export default authReducer;
