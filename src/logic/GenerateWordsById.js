import store from "../store/store";
import { generateWordsById } from "../actions/words"
export default function GenerateWordsById(id) { 
  store.dispatch(generateWordsById(id)); 
}
