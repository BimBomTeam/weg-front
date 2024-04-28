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
    type: "SET_HINT_VISIBLE",
    payload: {
      visibility,
    },
  };
};
