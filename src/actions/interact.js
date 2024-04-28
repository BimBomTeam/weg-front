export const setBossHit = (bossHit) => {
  return {
    type: "BOSS_HIT",
    payload: {
      bossHit,
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
