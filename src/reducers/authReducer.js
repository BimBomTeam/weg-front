import { SET_AUTHORIZE } from "../actions/setAuthorization";
import { LOGOUT } from "../actions/logout";

const initialState = {
  isAuthenticated: false,
  firstLogin: false,
  refreshToken: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHORIZE:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        firstLogin: action.firstLogin,
        refreshToken: action.token,
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
