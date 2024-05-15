import POST_getWords from "../logic/server/POST_getWords";

export const CHECK_WORDS = "CHECK_WORDS";
export const SET_LOADING = "SET_LOADING";

export const generateWordsById = (id) => {
  return async (dispatch) => {
    const wordsLoaded = sessionStorage.getItem(`wordsLoaded_${id}`);

    if (wordsLoaded) {
      dispatch(setWords(wordsLoaded));
    }
    // words is not defend from redux storage
    else {
      const fetchedWords = await POST_getWords(id);

      sessionStorage.setItem(`wordsLoaded_${id}`, JSON.stringify(fetchedWords));
      dispatch(setWords(JSON.stringify(fetchedWords)));
    }
  };
};

export const setWords = (words) => {
  return {
    type: "CHECK_WORDS",
    payload: {
      words: words,
    },
  };
};
export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    payload: loading,
  };
};
