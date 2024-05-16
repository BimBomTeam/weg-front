export const setBossHit = (bossHit) => {
  return {
    type: "BOSS_HIT",
    payload: {
      bossHit,
    },
  };
};
export const finishInteraction = (finishInteraction) => {
  return {
    type: "FINISH_INTERACTION",
    payload: {
      finishInteraction,
    },
  };
};
export const setPlayerHit = (playerHit) => {
  return {
    type: "PLAYER_HIT",
    payload: {
      playerHit,
    },
  };
};

export const setHintVisibility = (visibility) => {
  return {
    type: "SET_HINT_VISIBILITY",
    payload: {
      visibility,
    },
  };
};

export const setBattleVisibility = (visibility) => {
  return {
    type: "SET_BATTLE_VISIBILITY",
    payload: {
      visibility,
    },
  };
};

export const setChatVisibility = (visibility) => {
  return {
    type: "SET_CHAT_VISIBILITY",
    payload: {
      visibility,
    },
  };
};

export const setUiState = (state) => {
  return {
    type: "SET_UI_STATE",
    payload: {
      state,
    },
  };
};
