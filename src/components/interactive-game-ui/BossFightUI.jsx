import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import BossFightButton from "./BossFightButton";
import store from "../../store/store";
import POST_getBossWords from "../../logic/server/POST_getBossWords";
import QuestionUnit from "./BossFightQuestionUnit";
import api from "../../axiosConfig";
import { useDispatch } from "react-redux";
import FinishQuizModal from "../user-interface/user-interface/modals/FinishQuizModal";

const UiBossFight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordsArr = useRef();
  const wordsDtoArr = useRef();
  const [questionsArray, setQuestionsArray] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    fetchData();

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const fetchData = async () => {
    const response = await api.get("Words/get-all-today-words");
    if (response.status === 200) {
      const allWords = response.data;
      wordsDtoArr.current = allWords;
      const shuffledWords = shuffleArray(allWords.map((x) => x.name));

      wordsArr.current = shuffledWords;

      await setNextQuestion();
    }
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
    var dtoEl = wordsDtoArr.current.find((x) => x.name === answer.word);
    if (dtoEl === undefined || dtoEl === null) {
      dtoEl = wordsDtoArr.current.find((x) => x.name === answer.answer);
      if (dtoEl === null) dtoEl = {};
    }
    if (answer.answer.correct === true) {
      store.getState().interact.playerHit.playerHit();
      dtoEl.state = "Approved";
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    } else {
      store.getState().interact.bossHit.bossHit();
    }
    setNextQuestion();
  };

  const onTimeFinish = () => {
    store.getState().interact.bossHit.bossHit();
    setNextQuestion();
  };

  const finishQuiz = async () => {
    const response = await api.post("Words/save-words", wordsDtoArr.current);
    if (response.status !== 200) {
      console.log("error in words save");
    }
    setTimeout(() => {
      store.getState().interact.finishInteraction.finishInteraction();
    }, 1000);
    setShowModal(true); // Display the modal
    console.log("Liczba prawidłowych odpowiedzi:", correctAnswersCount);
  };

  if (currentQuestion) {
    return (
      <>
        <QuestionUnit
          quizUnit={currentQuestion}
          onAnswerClick={onAnswerClick}
          isVisible={isVisible}
          onTimeFinish={onTimeFinish}
          loading={loading}
        />
        {showModal && <FinishQuizModal closeModal={() => setShowModal(false)} correctAnswersCount={correctAnswersCount} />} {/* Render the modal when showModal === true */}
      </>
    );
  } else return <></>;
};

export default UiBossFight;
