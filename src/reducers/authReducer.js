import { CHECK_TOKEN } from "../actions/checkToken";

const initialState = {
  isAuthenticated: false,
};

function authReducer(state = initialState, action) {
  console.log("REDUCER (REDUX)");
  switch (action.type) {
    case CHECK_TOKEN:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
      default: 
        return state;
  }
}

export default authReducer;
