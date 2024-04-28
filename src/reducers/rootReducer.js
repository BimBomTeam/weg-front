import { combineReducers } from "redux";
import authReducer from "./authReducer";
import rolesReducer from "./rolesReducer";
import interactReducer from "./interactReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  roles: rolesReducer,
  interact: interactReducer,
});

export default rootReducer;
