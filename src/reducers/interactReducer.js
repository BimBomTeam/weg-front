// import { UiStates } from "../enums/uiStates";

export const UiStates = Object.freeze({
  NONE: "None",
  CHAT: "Chat",
  FIGHT: "Fight",
  HINT: "Hint",
});

const initialState = {
  bossHit: () => {},
  playerHit: () => {},
  finishInteraction: () => {},
  isHintVisible: false,
  isBattleVisibility: false,
  isChatVisibility: false,
  uiState: UiStates.NONE,
};

const interactReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOSS_HIT":
      return {
        ...state,
        bossHit: action.payload,
      };
    case "FINISH_INTERACTION":
      return {
        ...state,
        finishInteraction: action.payload,
      };
    case "PLAYER_HIT":
      return {
        ...state,
        playerHit: action.payload,
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
    case "SET_UI_STATE":
      if (state.uiState === action.payload.state) {
        return state;
      }
      return {
        ...state,
        uiState: action.payload.state,
      };
    default:
      return state;
  }
};

export default interactReducer;
