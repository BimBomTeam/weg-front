const initialState = {
    words: [],
};

const wordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_WORDS":
      return {
        ...state,
        words: action.payload,
      };
    default:
      return state;
  }
};

export default wordsReducer;
