const initialState = {
  bossHit: () => {},
  isHintVisible: false,
  isBattleVisibility: false,
  isChatVisibility: false,
};

const interactReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOSS_HIT":
      return {
        ...state,
        bossHit: action.payload,
      };
    case "SET_HINT_VISIBILITY":
      if (state.isHintVisible === action.payload.visibility) return state;
      return {
        ...state,
        isHintVisible: action.payload.visibility,
      };
    case "SET_BATTLE_VISIBILITY":
      if (state.isBattleVisibility === action.payload.visibility) return state;
      return {
        ...state,
        isBattleVisibility: action.payload.visibility,
      };
    case "SET_CHAT_VISIBILITY":
      if (state.isChatVisibility === action.payload.visibility) return state;
      return {
        ...state,
        isChatVisibility: action.payload.visibility,
      };
    default:
      return state;
  }
};

export default interactReducer;
