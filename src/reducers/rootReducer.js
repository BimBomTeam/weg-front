import { combineReducers } from "redux";
import authReducer from "./authReducer";
import rolesReducer from "./rolesReducer";
import interactReducer from "./interactReducer";
import wordsReducer from './wordsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  roles: rolesReducer,
  words: wordsReducer,
  interact: interactReducer,
});

export default rootReducer;
