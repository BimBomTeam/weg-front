const initialState = {
  words: [],
  wordLoading: false,
};

const wordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_WORDS":
      return {
        ...state,
        words: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        wordLoading: action.payload,
      };
    default:
      return state;
  }
};

export default wordsReducer;
