import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import BossFightButton from "./BossFightButton";
import store from "../../store/store";
import POST_getBossWords from "../../logic/server/POST_getBossWords";
import QuestionUnit from "./BossFightQuestionUnit";
import api from "../../axiosConfig";
import { useDispatch } from "react-redux";

const UiBossFight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordsArr = useRef();
  const [questionsArray, setQuestionsArray] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const fetchData = async () => {
    var allWords = JSON.parse(sessionStorage.getItem("words"));
    const shuffledWords = shuffleArray(
      Object.values(allWords)
        .map((wordsArray) => wordsArray.map((x) => x.name))
        .flat()
    );

    console.log(shuffledWords);
    wordsArr.current = shuffledWords;

    await setNextQuestion();
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const setNextQuestion = async () => {
    const idx = currentIndex + 1;
    if (idx >= wordsArr.current.length) {
      finishQuiz();
      return;
    }
    if (idx >= questionsArray.length) {
      const question = await fetchByIndex(idx);
      const tmpArr = [...questionsArray.slice(), question];
      console.log("tmpArr", tmpArr);
      setQuestionsArray(tmpArr);
      setCurrentQuestion(question);
      if (wordsArr.current.length - idx > 1) {
        fetchByIndex(idx + 1);
      }
    } else {
      const question = questionsArray.at(idx);
      setCurrentQuestion(question);
    }
    setCurrentIndex(idx);
    setLoading(false);
    setIsVisible(true);
  };

  const fetchByIndex = async (index) => {
    const response = await api.post("AiCommunication/get-boss-quiz", {
      word: wordsArr.current[index],
    });
    console.log("response: ", response);
    if (response.status === 200) {
      return response.data;
    }
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 27) {
      setIsVisible(false);
    }
  };

  const onAnswerClick = (answer) => {
    setLoading(true);
    console.log(answer);
    if (answer.correct === true) {
      store.getState().interact.playerHit.playerHit();
    } else {
      store.getState().interact.bossHit.bossHit();
    }
    setNextQuestion();
  };

  const onTimeFinish = () => {
    store.getState().interact.bossHit.bossHit();
    setNextQuestion();
  };

  const finishQuiz = () => {
    setTimeout(() => {
      store.getState().interact.finishInteraction.finishInteraction();
    }, 1000);
  };

  if (currentQuestion) {
    return (
      <QuestionUnit
        quizUnit={currentQuestion}
        onAnswerClick={onAnswerClick}
        isVisible={isVisible}
        onTimeFinish={onTimeFinish}
        loading={loading}
      />
    );
  } else return <></>;
};

export default UiBossFight;
