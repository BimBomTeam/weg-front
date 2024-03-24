import { createStore } from "redux";
import authReducer from "../reducers/authReducer";

console.log("STORE (REDUX)");
const store = createStore(authReducer);

export default store;
