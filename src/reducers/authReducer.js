import { CHECK_TOKEN } from "../actions/checkToken";
import { LOGOUT } from "../actions/logout";

const initialState = {
  isAuthenticated: false,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_TOKEN:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
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
