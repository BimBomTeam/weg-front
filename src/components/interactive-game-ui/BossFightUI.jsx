import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import BossFightButton from "./BossFightButton";
import store from "../../store/store";
import POST_getBossWords from "../../logic/server/POST_getBossWords";

const UiBossFight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const getWords = await POST_getBossWords({
        "level": "b1",
        "role": "cooker"
      })
      setIsVisible(true);
      setAnswers(getWords.words);
    }
    fetchData();
  }, []);


  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(150%)",
  });

  const questionAnimationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-150%)",
  });

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === 27) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const onAnswerClick = (text) => {

    store.getState().interact.bossHit.bossHit();
    // bossHit();
  };

  return (
    <div className="BossFightContainer" style={{ justifyContent: "center" }}>
      <animated.button className="Question" style={questionAnimationProps}>
        Dokąd nocą tupta jeż, możesz wiedzieć jeśli chcesz
      </animated.button>
      <animated.div className="Answers" style={animationProps}>
        {answers.map((answer, idx) => {
          return (
            <BossFightButton text={answer} onClick={onAnswerClick} key={idx} />
          );
        })}
      </animated.div>
      <div className="clock-container">
        <animated.div className="clock-bg" style={questionAnimationProps}>
          <CountdownCircleTimer isPlaying duration={60} colors={["#004777"]}>
            {({ remainingTime }) => <div className="time">{remainingTime}</div>}
          </CountdownCircleTimer>
        </animated.div>
      </div>
    </div>
  );
};

export default UiBossFight;
