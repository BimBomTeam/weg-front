const initialState = {
  bossHit: () => {},
  isHintVisible: false,
};

const interactReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOSS_HIT":
      return {
        ...state,
        bossHit: action.payload,
      };
    case "SET_HINT_VISIBLE":
      return {
        ...state,
        isHintVisible: action.payload,
      };
    default:
      return state;
  }
};

export default interactReducer;
