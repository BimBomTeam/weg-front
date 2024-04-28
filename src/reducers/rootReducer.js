import { combineReducers } from 'redux';
import authReducer from './authReducer';
import rolesReducer from './rolesReducer'; 
import wordsReducer from './wordsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  roles: rolesReducer,
  words: wordsReducer,
});

export default rootReducer;